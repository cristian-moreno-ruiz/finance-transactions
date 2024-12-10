# Finance Transactions Service

This project is a microservice designed to fetch and aggregate event data from an external provider and make it available via a REST API. Built with TypeScript and Express, it uses MongoDB as the database and follows Hexagonal Architecture principles to promote scalability, maintainability, and ease of testing.

According to the specifications, it implements two main functionalities:
- It fetches events from an external provider and keeps them in sync in a local database.
- It exposes an API endpoint where users can search active events by start and end dates following the Open API specification provided: https://app.swaggerhub.com/apis-docs/luis-pintado-feverup/backend-test/1.0.0

As specified by the Fever Talent team, this application has been implemented using my most comfortable language, which is Typescript in this case.

## How to run it

1. Clone this repository.
2. Install dependencies: `npm install`
3. Start the application (it will also start the database): `npm run start`
4. You can now browse events, example: http://localhost:3000/transactions/search?from=2024-02-01&to=2024-07-03
5. Tests can be run with: `npm run test`

## Application Architecture

### Hexagonal Architecture

This application has been implemented following Hexagonal Architecture principles in order to keep business logic and external dependencies separate. Hexagonal Architecture is a software design pattern that promotes the separation of an application internals from its interactions with the external world. Each interaction with external actors is defined by a contract which is referred as a port. 

Ports are just a definition of how the application interacts with actors, and they are agnostic to the technology or specific implementation. On the other hand, adapters are the actual implementation of these ports, using a specific technology. The main idea is that an adapter can easily be replaced by another one, whether it uses a different technology, or it is just a mock for testing, while maintaining the core application business logic unaware of this change. 

Hexagonal Architecture offers several key benefits by establishing clear boundaries between the core domain logic and external dependencies, making the system resilient to infrastructure changes. Additionally, it simplifies testing by allowing the core domain logic to be tested independently of external dependencies. Overall, this approach creates a highly decoupled, adaptable, and testable system that can scale easily in terms of new requirements.

### Application Overview

Following Hexagonal Architecture principles, the application defines 4 main ports which surround the core business logic. This diagram represents how the system has been designed:

![image](https://github.com/user-attachments/assets/388c9002-808c-4a4d-ace0-f5a366cace46)

Driver ports:
- EventSearchPort: This port allows the application to serve user queries and return events based on search parameters.
- EventIngestionPort: This port triggers the process that fetches, processes, and updates event information within the system.

Driven ports:
- EventRepositoryPort: This port abstracts the database operations for storing, updating, and retrieving event data.
- EventSourcePort: This port defines the interface for connecting to the external provider API to fetch the latest events

Below is a diagram that shows a visual representation of the system using  the hexagon analogy:

### Project structure

The project source code is structured within 4 main directories, each of which server a different purpose:

- `application`: The application directory contains the business logic, defining the main uses cases like retrieving events from the external source, or serving the event search functionality.
- `domain`: holds The definition of the domain models that define core business logic and the ports definition, which abstract dependencies on external services.
- `infrastructure`: This directory contains the adapters implementation, REST API adapter, cron scheduler, the database repository and the thrid party API client. It is also the entry point for the server implementation which imports the necessary dependencies and orchestrates the whole application infrastructure.

## Design decisions

While developing the solution, some technical decisions have been taken for different reason. Here are some of the most relevant ones.

### Hexagonal Architecture

As already stated previously, Hexagonal Architecture has been chosen in order to decouple the core domain logic from other technical details later discussed in this section, while contributing to an approach towards clean code and making sure we respect main SOLID principles. 

### TypeScript + Express

As per the application language, TypeScript was chosen primarily because it’s my language of preference, being a modern language also backed by a huge community of developers. Additionally, its typing capabilities allow us to properly define typed classes and interfaces, making sure we can define and implement the necessary business objects.

Express was selected as the web framework due to its simplicity, flexibility and efficiency when building RESTful APIs. The combination of TypeScript and Express provides a clean, organized setup that can scale effectively,

### Jest

Jest was selected as the testing framework for its simplicity, and comprehensive feature set, which includes mocking, assertions, and snapshot testing, all of them using just one tool.

### Github Actions

Github actions was a straight forward choice when it comes to CI pipeline, as it is natively supported in Github, where the application requirements were provided, and it offers a complete ecosystem with large customisation options, while offering a competitive pricing, staying in the free tier in this case. 

### MongoDB

Regarding the database technology, both relational and non-relational databases were considered. While SQL databases offer well-defined schemas, with clear relationships and the ability to query related entities (joins), they tend to be less scalable and flexible. On the other hand, NoSQL databases tend to offer better scalability (specially horizontal scalability), and increased schema flexibility, in addition to more modern features like vector search. Specifically, MongoDB was chosen, mainly because of the following key reasons:
- Development Flexibility: MongoDB provides great flexibility which eases the development cycle of new featuers, while still being able to keeping a consistent schema definition using libraries like mongoose.
- Horizontal Scalability: MongoDB natively supports sharding, which enables horizontal scaling, that being one of the major benefits when dealing with a large amount of traffic.
- Vector and Geo Search: MongoDB offers cutting edge features like GeoSpacial or vector search, which would be two potential features we may want to implement in the future in order to supercharge our event search future with both geographical event search or AI features like recommendations or similar events.

### Polling the external event provider

As a solution to ingest provider events into the system, the coice was to use a polling mechanism with a cron job to retrieve data at regular intervals. While this approach is not ideal compared to a more optimal solution like a webhook handler (which would allow the provider to push updates as they occur), it was necessary to adapt to the provider’s current capabilities, which do not support webhooks.

Other approaches were considered during the system design but, were discarded for the following reasons:
- Fetching data on application restart: While this is optimal in terms of resources used, data would become outdated soon after application is started/restarted, leading to stale information unless the application runs/restarts for short periods of time.
- Per-request data fetch: This solution would ensure the most up to date information when users request events, but would significantly slow down response time, thus increasing request latency over the requirements.

Given these limitations, polling via a cron job was the best option for achieving a balance between data freshness and system performance. This solution was implemented in a flexible way where the polling interval can be adjusted to optimize resource usage as more insight into how frequently the external data changes is obtained. Additionally, this implementation remains flexible to adapt as the provider's capacity evolve, for example if a webhook system is implemented in the future, or if the system detects any additional events where data should be updated in addition to a fixed schedule.

## Scaling the application for performance

The current codebase is designed with scalability in mind, both in terms of technical growth and team expansion. Key architectural choices make it easy to add new features, support additional providers, and increase developer efficiency:
- Design pattern: enforcing a design pattern like hexagonal architecture helps with the development of new features, replacement of technology (adapters) without affecting the core application logic, and the presence of unit tests and a CI pipeline helps ensuring functionality is maintained, while serving as specs definition.
- Adding new providers: the current ingestion method allows seamlessly adding more providers by adding more sources to the `infrastructure/sources` directory, as long as they respect the EventSourcePort definition.

In addition to facilitating maintenance and scaling of the codebase, it is crucial to ensure performance requirements are met. In the following sections, several strategies will be discussed that help achieving the highest performance, resulting in a system diagram like the following:

<img width="863" alt="image" src="https://github.com/user-attachments/assets/03345832-d288-4d8b-9eaf-c1ec8c066a6c">

### Split the workloads

The current implementation relies on a single server to run both the Http REST API, and the event ingestion service. While this is enough for a small MVP, in a real environment with high request volume it is not optimal, as it prevents the system to scale independently. Therefore, a first approach to scale the current application would be to split the current service in two different workloads, so strategies can be applied independently to each service as described in the following sections.

### Scale the API horizontally with Load Balancers

When dealing with a high volume of requests, webservers can become a bottleneck, and one of the best solutions to it is to increase the number of instances serving the application. One approach could be to use Kubernetes and use horizontal pod autoscaling, which is an advanced setup that allows a system deploy new pods when the load of the system increases (based on metrics like CPU load of existing pods, for example).

This approach requires to properly setup a Load Balancer that sits in front of the system and distributes incoming requests. These load balancers can typically be setup in the main cloud providers like AWS's Elastic Load Balancers (ELB) or GCP's Google Cloud Load Balancer.

### Database optimisation

As previously stated, the choice of MongoDB was made with with performance optimisation in mind, as several strategies can be applied. First of all, MongoDB offers several indexing options which helps narrowing down complex queries in large datasets, if the proper strategy is followed when designing the indexes (keep ESR rule in mind when designing indexes).

Additionally, MongoDB provides seamless sharding and replication. Sharding is a strategy that helps scaling horizontally the database by copying pieces of data to different instances, which then work together to retrieve all the data when necessary. On the other hand, replica sets allows copying the entire dataset into additional instances, so the read load can be distributed. Both strategies can be seamlessly enabled in MongoDB.

### Caching

Another strategy when dealing with large amounts of traffic is making sure frequently accessed data is cached. There are several caching strategies and technologies (like redis or memcached), but since the current system is read heavy, a suitable strategy would be a Read through cache. Therefore, identical requests would not hit the database when they are occur in a small period of time. A proper TTL should be set in order to ensure stale data is refreshed periodically, and also some cache invalidation rules could be implemented (for example when a user purchase an event ticket it could invalidate the cache for that specific event).

### Improving the polling mechanism

One of the most relevant topics in this application is to keep consistent event data from the external event providers. A couple possible strategies could help manage the load of the system while keeping data up to date:
- Adaptive polling: Implement dynamic adjustments to the polling frequency based on traffic patterns or recent data changes. For example, increase polling frequency during peak hours and reduce it during low-activity periods. This minimises unnecessary load while ensuring data freshness.
- Event Driven polling: It possible, it would be beneficial to reduce polling by introducing provider-based events (if available) or some kind of heuristics to trigger updates when likely.

With regards to this, a Message Queue like RabbitMQ could be beneficial in order to handle events asynchronously. Therefore, instead of responding synchronously to external events (or even to cron jobs), a message could be added to the queue each time we need to refresh data from a provider. Therefore, it would be possible to control (and throttle) event ingestion events if many of them happen to arrive at the same time. Additionally, this component might be useful for the next section.

### Dealing with large amounts of events and zones

In a real life scenario, the list of events in the returned XML (or any other method used by other providers), could contain thousands of events with hundreds of zones, resulting in very large files. Processing these files synchronously can produce different types of incidents such as timeouts, exceeding application memory limits or excessive slow queries.

A better solution to deal with that would be to implement a streaming file processing system using batches of events. Leveraging the message queue mentioned in the previous section, the proposed solution could be composed of two different queues, one for processing new source files (`file-processing-queue`) and another one to process event batches ( `event-batch-queue`):
1. A message arrives to the `file-processing-queue` with a large file to be processed.
2. The consumer picks up the task and starts streaming the file, creating chunks with batches of events (for example 100 events per batch).
3. For every batch, a new message is sent to the `event-batch-queue`.
4. The consumer of the `event-batch-queue` would pick up the message and insert/update the current batch of events.
