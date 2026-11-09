"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Network,
  Server,
  Database,
  Layers,
  CheckCircle2,
  Circle,
  Play,
  ExternalLink,
  BookOpen,
  FileText,
  Search,
  Clock,
  Compass,
  X,
  Code2,
  Workflow,
  Cpu,
  Shield,
  HardDrive,
  Lightbulb,
  Radio,
  ArrowRight,
  Calculator,
} from "lucide-react";
import { recordProgressToggle, fetchBackendProgress } from "@/lib/progress";
import { ArchitectureCanvas } from "@/components/systemdesign/ArchitectureCanvas";
import { useTheme } from "@/context/ThemeContext";

export type SystemDesignTrackId = "fundamentals" | "practice_problems";

export interface SystemDesignResource {
  title: string;
  type: "Paper" | "Engineering Blog" | "Guide" | "Tool" | "Book" | "Article";
  description: string;
  url: string;
}

export interface SystemDesignLevel {
  id: string;
  trackId: SystemDesignTrackId;
  levelNumber: number;
  title: string;
  shortTitle: string;
  tag: "FOUNDATION" | "CORE" | "ADVANCED" | "CASE STUDY" | "SPECIALIZED";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  description: string;
  x: number; // 0..100 percentage
  y: number; // pixels on canvas
  youtubeVideoId: string;
  videoTitle: string;
  videoChannel: string;
  videoDuration: string;
  keyTakeaways: string[];
  resources: SystemDesignResource[];
  architecturalBlueprint: {
    overview: string;
    capacityMath?: string;
    apiEndpoints?: string[];
    coreComponents: string[];
    tradeOffs: string;
  };
}

export interface SystemDesignTrackMeta {
  id: SystemDesignTrackId;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  levels: SystemDesignLevel[];
}

// -------------------------------------------------------------
// TRACK 1: A-to-Z System Design Fundamentals (10 Levels)
// -------------------------------------------------------------
const FUNDAMENTALS_LEVELS: SystemDesignLevel[] = [
  {
    id: "sd_fund_1",
    trackId: "fundamentals",
    levelNumber: 1,
    title: "System Design Framework & Latency Numbers",
    shortTitle: "Framework & Latency",
    tag: "FOUNDATION",
    difficulty: "Beginner",
    estimatedMinutes: 45,
    description:
      "4-step interview structure, clarifying functional vs non-functional requirements, back-of-the-envelope capacity estimations, and numbers every engineer should know.",
    x: 50,
    y: 80,
    youtubeVideoId: "0163cssUxLA",
    videoTitle: "System Design Interview - Approach and structure - How To [Part1]",
    videoChannel: "Gaurav Sen",
    videoDuration: "14:15",
    keyTakeaways: [
      "4-Step Structured Process: 1. Understand the problem & establish scope (5m), 2. High-level design & API agreement (10m), 3. Design deep-dive (20m), 4. Wrap-up & bottlenecks (10m).",
      "Latency Hierarchy: L1 cache reference (0.5 ns), Main memory RAM (100 ns), SSD random read (100 us), Round-trip datacenter (500 us), Send 1MB over 1Gbps network (10 ms), Transatlantic packet (150 ms).",
      "Capacity Rule of Thumb: 1 million requests/day ~= 12 requests/second. 100M requests/day ~= 1,200 requests/second. Always account for 3x-5x peak traffic.",
      "High Availability 9s: 99.9% (Three 9s) = 8.76 hours downtime/year; 99.99% (Four 9s) = 52.6 minutes downtime/year; 99.999% (Five 9s) = 5.26 minutes downtime/year.",
    ],
    resources: [
      {
        title: "Latency Numbers Every Programmer Should Know",
        type: "Guide",
        description: "Interactive visual comparison of CPU cache, memory, disk, and network transfer speeds.",
        url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html",
      },
      {
        title: "The System Design Primer: Capacity Estimations",
        type: "Guide",
        description: "Donne Martin's comprehensive cheat sheet on byte conversions, powers of two, and estimations.",
        url: "https://github.com/donnemartin/system-design-primer#powers-of-two-table",
      },
    ],
    architecturalBlueprint: {
      overview: "Standardized 4-step framework ensures you never prematurely design without establishing functional boundaries, read/write ratios, and availability targets.",
      capacityMath: "Daily Active Users: 50M | Actions/user: 10/day | Total QPS = (50M * 10) / 86400 ≈ 5,800 QPS | Peak QPS (3x) = 17,400 QPS",
      coreComponents: [
        "Requirement Clarification Module (Scope boundary)",
        "Capacity Estimator (QPS, Storage, Bandwidth, Memory)",
        "High-Level Block Diagram (Client -> Gateway -> App -> DB)",
        "Deep-Dive Bottleneck Analyzer (SPOFs, Caching, Sharding)",
      ],
      tradeOffs: "Prioritizing strong consistency over high availability (CAP) versus optimizing for sub-millisecond read latency via eventual consistency.",
    },
  },
  {
    id: "sd_fund_2",
    trackId: "fundamentals",
    levelNumber: 2,
    title: "Load Balancing & Reverse Proxies (L4 vs L7)",
    shortTitle: "Load Balancing",
    tag: "CORE",
    difficulty: "Beginner",
    estimatedMinutes: 50,
    description:
      "Traffic distribution, Layer 4 (Transport TCP) vs Layer 7 (Application HTTP) routing, NGINX vs HAProxy, Round Robin, Least Connections, and SSL Termination.",
    x: 78,
    y: 240,
    youtubeVideoId: "K0Ta65OqQkY",
    videoTitle: "What is LOAD BALANCING? ⚖️",
    videoChannel: "Gaurav Sen",
    videoDuration: "10:14",
    keyTakeaways: [
      "Layer 4 vs Layer 7: L4 routes packets blindly based on IP and TCP/UDP ports without inspecting payload; L7 inspects HTTP headers, cookies, and URI paths for intelligent routing.",
      "Balancing Algorithms: Round Robin (equal stateless nodes), Weighted Least Connections (long-lived stateful sessions), IP Hash (sticky sessions).",
      "SSL Termination: Offloads CPU-intensive TLS cryptographic handshakes at the edge load balancer, allowing backend microservices to communicate over plain HTTP.",
      "High Availability for Load Balancers: Active-Passive pairs using VRRP (Virtual Router Redundancy Protocol) and floating virtual IPs avoid making the load balancer a Single Point of Failure (SPOF).",
    ],
    resources: [
      {
        title: "NGINX: What is Load Balancing?",
        type: "Guide",
        description: "Official guide on reverse proxying, upstream pools, session persistence, and active health checks.",
        url: "https://www.nginx.com/resources/glossary/load-balancing/",
      },
      {
        title: "HAProxy Architecture Guide",
        type: "Guide",
        description: "In-depth guide on event-driven non-blocking I/O and zero-copy packet switching.",
        url: "https://www.haproxy.com/documentation/hapee/latest/onepage/",
      },
    ],
    architecturalBlueprint: {
      overview: "Load balancers distribute incoming application traffic across redundant server instances, performing active health check probes to evict degraded nodes.",
      capacityMath: "100k incoming connections -> 2x HAProxy L4 instances (Active/Passive) -> 10x NGINX L7 reverse proxies -> 50x Application workers.",
      coreComponents: [
        "DNS Round Robin (GeoDNS edge resolution)",
        "L4 Load Balancer (TCP routing via HAProxy / AWS NLB)",
        "L7 Reverse Proxy (HTTP path routing & SSL offloading via NGINX / Envoy)",
        "Active Health Check Daemon (Evicts failing instances automatically)",
      ],
      tradeOffs: "L7 routing offers content-based path routing and caching but incurs higher CPU overhead and latency compared to wire-speed L4 packet routing.",
    },
  },
  {
    id: "sd_fund_3",
    trackId: "fundamentals",
    levelNumber: 3,
    title: "Consistent Hashing & Dynamic Ring Partitioning",
    shortTitle: "Consistent Hashing",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 55,
    description:
      "Overcoming modulo rehashing stampedes, the 360-degree hash ring, virtual nodes (vnodes), uniform key distribution, and node failure replication.",
    x: 50,
    y: 400,
    youtubeVideoId: "zaRkONvyGr8",
    videoTitle: "What is CONSISTENT HASHING and Where is it used?",
    videoChannel: "Gaurav Sen",
    videoDuration: "15:42",
    keyTakeaways: [
      "The Modulo Problem: Standard hash(key) % N requires reshuffling almost 100% of cached keys whenever a single node is added or removed (N changes).",
      "Consistent Hashing Ring: Maps both server IDs and data keys to positions on a [0, 2^32 - 1] circular ring; a key is assigned to the first server encountered clockwise.",
      "Minimal Key Migration: Adding or removing a node only moves k / N keys on average, avoiding cache invalidation avalanches.",
      "Virtual Nodes (vnodes): Each physical node is assigned 100-300 virtual tokens randomly spaced on the ring, smoothing variance and preventing hotspot clusters.",
    ],
    resources: [
      {
        title: "Karger et al.: Consistent Hashing and Random Trees (1997)",
        type: "Paper",
        description: "The seminal MIT research paper that introduced consistent hashing to relieve web server hot spots.",
        url: "https://www.cs.princeton.edu/courses/archive/fall09/cos518/papers/chash.pdf",
      },
      {
        title: "Dynamo: Amazon's Highly Available Key-value Store",
        type: "Paper",
        description: "How Amazon utilizes consistent hashing with virtual nodes to power shopping carts at scale.",
        url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
      },
    ],
    architecturalBlueprint: {
      overview: "Consistent hashing partitions keys across distributed cache clusters and database nodes, ensuring dynamic horizontal scaling without full repartitioning.",
      capacityMath: "With N servers and K keys, adding 1 node only reassigns K/(N+1) keys instead of ~K*(N/(N+1)) in naive modulo hashing.",
      coreComponents: [
        "Cryptographic Hash Function (MD5 or SHA-256 mapping to 2^32 space)",
        "Consistent Hash Ring (Sorted balanced binary search tree / red-black tree)",
        "Virtual Node Allocator (Assigns 100-256 vnode coordinates per physical host)",
        "Replication Coordinator (Selects next N distinct physical nodes on ring)",
      ],
      tradeOffs: "Virtual nodes achieve near-perfect uniform distribution but require maintaining larger in-memory sorted token routing tables across clients.",
    },
  },
  {
    id: "sd_fund_4",
    trackId: "fundamentals",
    levelNumber: 4,
    title: "Caching Strategies & Redis (Cache-Aside, Evictions)",
    shortTitle: "Caching & Redis",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 60,
    description:
      "In-memory caching architectures, Cache-Aside vs Write-Through vs Write-Back, LRU/LFU eviction policies, Cache Stampede, Avalanche, and Penetration mitigations.",
    x: 22,
    y: 560,
    youtubeVideoId: "U3RkDLtS7uY",
    videoTitle: "What are Distributed CACHES and how do they manage DATA CONSISTENCY?",
    videoChannel: "Gaurav Sen",
    videoDuration: "14:50",
    keyTakeaways: [
      "Cache-Aside (Lazy Loading): Application reads from cache; on miss, reads from DB and updates cache. Only requested data is cached, but incurs initial miss latency.",
      "Write-Through vs Write-Back: Write-Through writes to cache and DB synchronously (safe, higher write latency); Write-Back writes to cache and batches async DB writes (blazing fast, risk of data loss on crash).",
      "Cache Stampede (Thundering Herd): Thousands of concurrent requests hit DB simultaneously when a popular key expires; mitigated using mutex locks or probabilistic early expiration.",
      "Cache Penetration & Bloom Filters: Malicious queries for non-existent IDs bypass cache and hammer database; mitigated using Bloom filters or caching null objects with short TTLs.",
    ],
    resources: [
      {
        title: "Redis Architecture & Data Structures Deep-Dive",
        type: "Guide",
        description: "Memory models, strings, hashes, sorted sets, streams, and single-threaded event loop architecture.",
        url: "https://redis.io/docs/latest/develop/data-types/",
      },
      {
        title: "Facebook: Scaling Memcache (NSDI 2013)",
        type: "Paper",
        description: "How Meta scaled memcached to billions of requests/sec with leased keys and cold cache warmers.",
        url: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf",
      },
    ],
    architecturalBlueprint: {
      overview: "Distributed memory tier placed between stateless application services and durable databases to slash read latency from 15ms down to <1ms.",
      capacityMath: "100k Read QPS | 95% Cache Hit Ratio -> 95k hits served in 0.8ms by Redis Cluster; only 5k queries touch the primary database.",
      coreComponents: [
        "Distributed Cache Cluster (Redis / Memcached with cluster sharding)",
        "Cache Invalidation Bus (Pub/Sub notifications upon database writes)",
        "Bloom Filter Front (Rejects guaranteed-absent keys before touching cache/DB)",
        "TTL & Eviction Engine (LRU / LFU with volatile-lru policy)",
      ],
      tradeOffs: "Write-Back caching maximizes throughput for heavy writes but sacrifices crash durability if cache instances reboot before database flush.",
    },
  },
  {
    id: "sd_fund_5",
    trackId: "fundamentals",
    levelNumber: 5,
    title: "Database Architecture: SQL vs NoSQL Selection",
    shortTitle: "SQL vs NoSQL",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 55,
    description:
      "Relational databases vs Key-Value, Document, Wide-Column, and Graph stores; ACID transactional guarantees vs BASE eventual consistency, and schema evolution.",
    x: 50,
    y: 720,
    youtubeVideoId: "kkeFE6iRfMM",
    videoTitle: "How To Choose The Right Database?",
    videoChannel: "ByteByteGo",
    videoDuration: "08:12",
    keyTakeaways: [
      "Relational (RDBMS): PostgreSQL, MySQL. Rigid schema, normalized relational integrity, complex multi-table JOINs, strong ACID guarantees. Scales vertically easily.",
      "Document Stores: MongoDB, Couchbase. Semi-structured JSON/BSON, dynamic schema, hierarchical nested data. Best for catalog items and rapidly evolving payloads.",
      "Wide-Column: Apache Cassandra, ScyllaDB. LSM-tree architecture, distributed masterless peer-to-peer ring, massive write throughput. Best for time-series and sensor telemetry.",
      "ACID vs BASE: ACID (Atomicity, Consistency, Isolation, Durability) guarantees strict correctness; BASE (Basically Available, Soft-state, Eventual consistency) maximizes availability at scale.",
    ],
    resources: [
      {
        title: "Martin Kleppmann: Designing Data-Intensive Applications",
        type: "Book",
        description: "The authoritative industry text comparing relational, document, and graph data models.",
        url: "https://dataintensive.net/",
      },
      {
        title: "AWS: Purpose-Built Databases Comparison",
        type: "Guide",
        description: "Architectural comparison across RDS, DynamoDB, Neptune, Timestream, and OpenSearch.",
        url: "https://aws.amazon.com/products/databases/",
      },
    ],
    architecturalBlueprint: {
      overview: "Polyglot persistence architecture leverages relational databases for financial ledger transactions while routing high-velocity unstructured writes to NoSQL stores.",
      capacityMath: "RDBMS: Handles 5,000 complex transaction QPS on single replica. Cassandra cluster: Scales linearly to 500,000+ sequential write QPS across 20 nodes.",
      coreComponents: [
        "Relational Primary Tier (PostgreSQL with read-replicas for core business records)",
        "NoSQL Document Tier (MongoDB / DynamoDB for user profiles and nested objects)",
        "Wide-Column Time-Series Tier (Cassandra / ClickHouse for audit trails & analytics)",
        "Search Indexer (Elasticsearch / OpenSearch for full-text and fuzzy searching)",
      ],
      tradeOffs: "SQL provides bulletproof ACID consistency and expressive joins but limits horizontal partitioning across nodes; NoSQL scales horizontally effortlessly but pushes join logic into application code.",
    },
  },
  {
    id: "sd_fund_6",
    trackId: "fundamentals",
    levelNumber: 6,
    title: "Database Scaling: Sharding, Replication & Federation",
    shortTitle: "Database Sharding",
    tag: "ADVANCED",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Vertical vs horizontal database scaling, Master-Replica topologies, Shard Key selection (range vs hash-based), cross-shard joins, and distributed rebalancing.",
    x: 78,
    y: 880,
    youtubeVideoId: "5faMjKuB9bc",
    videoTitle: "What is DATABASE SHARDING?",
    videoChannel: "Gaurav Sen",
    videoDuration: "14:15",
    keyTakeaways: [
      "Master-Slave (Leader-Follower) Replication: Single write master replicates write-ahead log (WAL) to multiple read replicas; scales read QPS but write throughput remains bottlenecked.",
      "Horizontal Partitioning (Sharding): Splits table rows across separate physical database servers based on a Shard Key (e.g. hash(user_id) % num_shards).",
      "Shard Key Pitfalls: Bad shard keys (e.g. timestamp or country) create celebrity hotspots and uneven shard sizes. Good keys (composite or user_id hashes) distribute load uniformly.",
      "Cross-Shard Joins: Joining data across multiple independent database shards is computationally prohibitive; requires data denormalization or service-layer fan-out merges.",
    ],
    resources: [
      {
        title: "Vitess: Horizontal Scaling for MySQL",
        type: "Guide",
        description: "How YouTube and Slack scale MySQL databases horizontally with automated sharding and distributed query routing.",
        url: "https://vitess.io/docs/overview/what-is-vitess/",
      },
      {
        title: "PostgreSQL: Table Partitioning Documentation",
        type: "Guide",
        description: "Declarative range, list, and hash partitioning mechanisms in PostgreSQL.",
        url: "https://www.postgresql.org/docs/current/ddl-partitioning.html",
      },
    ],
    architecturalBlueprint: {
      overview: "Sharded database topology where client traffic is routed through a cluster proxy (e.g. Vitess) to specific physical database shards according to shard key hashes.",
      capacityMath: "10TB Total User Data -> 10 Shards (1TB each) | Single master capacity 5k writes/sec -> 10 sharded masters support 50k writes/sec aggregate.",
      coreComponents: [
        "Shard Router / Proxy (Inspects SQL queries and directs requests to target shard)",
        "Configuration Service (ZooKeeper / etcd storing shard ranges and master topology)",
        "Primary Shard Nodes (Independent databases holding partition subsets)",
        "Read Replica Sets (Asynchronous streaming replication from each primary shard)",
      ],
      tradeOffs: "Sharding enables virtually unlimited data storage and write scaling, but cross-shard ACID transactions require expensive Two-Phase Commit (2PC) protocols.",
    },
  },
  {
    id: "sd_fund_7",
    trackId: "fundamentals",
    levelNumber: 7,
    title: "Distributed Consensus, CAP Theorem & PACELC",
    shortTitle: "CAP & Consensus",
    tag: "ADVANCED",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Brewer's CAP Theorem, PACELC model, network partitions, split-brain scenarios, Quorum consensus (W + R > N), and the Raft consensus algorithm.",
    x: 50,
    y: 1040,
    youtubeVideoId: "k-Yaq8AHlFA",
    videoTitle: "L16: The CAP Theorem",
    videoChannel: "Martin Kleppmann",
    videoDuration: "25:30",
    keyTakeaways: [
      "CAP Theorem: In a distributed system with Network Partitions (P), you MUST choose either Consistency (C - every read returns latest write or error) OR Availability (A - every request receives non-error response).",
      "PACELC Model: If Partition (P): choose Availability (A) or Consistency (C); Else (E): choose Latency (L) or Consistency (C). Explains why systems like MongoDB or Dynamo make trade-offs even during normal operation.",
      "Quorum Consensus: Given N replicas, write quorum W, read quorum R: if W + R > N, at least one node in read set contains latest write, guaranteeing strong consistency.",
      "Raft Consensus: Solves distributed state machine replication via leader election, randomized heartbeats, log replication terms, and commit safety invariants.",
    ],
    resources: [
      {
        title: "Ongaro & Ousterhout: In Search of an Understandable Consensus Algorithm (Raft)",
        type: "Paper",
        description: "Stanford paper introducing Raft as a cleaner alternative to multi-Paxos.",
        url: "https://raft.github.io/raft.pdf",
      },
      {
        title: "Martin Kleppmann: Please Stop Calling Databases CP or AP",
        type: "Article",
        description: "Critical analysis of CAP theorem subtleties, network delay vs partition equivalence, and formal PACELC distinctions.",
        url: "https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html",
      },
    ],
    architecturalBlueprint: {
      overview: "Consensus cluster where odd number of nodes (3, 5, or 7) coordinate state changes via quorum elections to prevent split-brain partition corruption.",
      capacityMath: "Cluster of N=5 nodes: Tolerates up to 2 concurrent node failures. Quorum requires (5/2)+1 = 3 node acknowledgments for committed writes.",
      coreComponents: [
        "Raft Consensus Engine (Leader election, term counter, log compaction)",
        "Write-Ahead Log (WAL) (Append-only deterministic state transitions)",
        "Quorum Replicator (Broadcasts AppendEntries RPCs to follower replicas)",
        "State Machine (Applies committed log entries to local application state)",
      ],
      tradeOffs: "CP systems reject incoming writes during network splits to preserve truth; AP systems accept writes on both partition sides and resolve conflicts later via vector clocks.",
    },
  },
  {
    id: "sd_fund_8",
    trackId: "fundamentals",
    levelNumber: 8,
    title: "Asynchronous Messaging & Event Streaming (Kafka)",
    shortTitle: "Message Queues & Kafka",
    tag: "CORE",
    difficulty: "Intermediate",
    estimatedMinutes: 60,
    description:
      "Decoupled microservices, Point-to-Point queues vs Pub/Sub, Apache Kafka partition logs, consumer groups, backpressure handling, and delivery semantics.",
    x: 22,
    y: 1200,
    youtubeVideoId: "HZklgPkboro",
    videoTitle: "System Design: Apache Kafka In 3 Minutes",
    videoChannel: "ByteByteGo",
    videoDuration: "03:45",
    keyTakeaways: [
      "Decoupling & Asynchrony: Producers publish events without waiting for consumers to process them; smooths sudden traffic spikes (load leveling).",
      "Point-to-Point (RabbitMQ) vs Distributed Log (Kafka): RabbitMQ removes messages once consumed by a worker; Kafka retains messages in partitioned commit logs for days, allowing replay.",
      "Kafka Partitions: Topics are partitioned across cluster brokers; messages with the same partition key (e.g. user_id) are strictly ordered within that partition.",
      "Delivery Semantics: At-most-once (fast, potential loss), At-least-once (default, requires consumer idempotency), Exactly-once (Kafka transactional producer/consumer API).",
    ],
    resources: [
      {
        title: "Jay Kreps: The Log - What Every Software Engineer Should Know",
        type: "Article",
        description: "Canonical technical essay on real-time data integration, append-only logs, and stream processing architectures.",
        url: "https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-data-integrating",
      },
      {
        title: "Apache Kafka Documentation & Architecture",
        type: "Guide",
        description: "Core broker concepts, consumer offset commits, KRaft metadata quorum, and zero-copy OS disk transfer.",
        url: "https://kafka.apache.org/documentation/",
      },
    ],
    architecturalBlueprint: {
      overview: "Event-driven asynchronous backbone decoupling order placement, payment verification, email notifications, and inventory updates.",
      capacityMath: "1M daily orders -> 500 orders/sec peak -> Kafka topic with 16 partitions easily absorbs 50,000 writes/sec via sequential disk I/O.",
      coreComponents: [
        "Event Producer (Application services publishing JSON / Avro payloads)",
        "Kafka Broker Cluster (Topic partitions distributed across brokers with replication factor 3)",
        "Consumer Groups (Parallel subscriber workers maintaining committed offset pointers)",
        "Dead-Letter Queue (DLQ) (Isolates malformed poison pill events for inspection)",
      ],
      tradeOffs: "Eventual consistency across asynchronous consumer workers requires building idempotent operations and handling out-of-order event arrivals.",
    },
  },
  {
    id: "sd_fund_9",
    trackId: "fundamentals",
    levelNumber: 9,
    title: "API Gateway, Rate Limiting & Service Discovery",
    shortTitle: "API Gateway & Security",
    tag: "ADVANCED",
    difficulty: "Intermediate",
    estimatedMinutes: 55,
    description:
      "Single entrypoint architecture, JWT authentication, Token Bucket vs Leaky Bucket algorithms, distributed rate limiting with Redis Lua scripts, and Circuit Breaker.",
    x: 50,
    y: 1360,
    youtubeVideoId: "6ULyxuHKxg8",
    videoTitle: "What is API Gateway?",
    videoChannel: "ByteByteGo",
    videoDuration: "06:12",
    keyTakeaways: [
      "API Gateway Centralization: Single secure entrypoint handling SSL termination, JWT authentication, rate limiting, and request transformation across downstream services.",
      "Token Bucket Algorithm: Tokens added at constant refill rate r up to capacity b; allows instantaneous bursts up to bucket size without dropping packets.",
      "Distributed Rate Limiting with Redis: Uses Redis sorted sets (ZADD / ZREMRANGEBYSCORE) or atomic Lua scripts to prevent race conditions across parallel gateway nodes.",
      "Circuit Breaker Pattern (Netflix Hystrix / Resilience4j): Tripping from Closed -> Open when failure rate crosses threshold stops cascading failures from taking down the cluster.",
    ],
    resources: [
      {
        title: "Kong API Gateway Architecture Guide",
        type: "Guide",
        description: "High-performance OpenResty/Nginx plugin architecture for rate limiting and service meshes.",
        url: "https://docs.konghq.com/gateway/latest/architecture-and-design/",
      },
      {
        title: "Martin Fowler: Circuit Breaker Pattern",
        type: "Article",
        description: "Classic design pattern essay on failing fast and automated self-healing fallback states.",
        url: "https://martinfowler.com/bliki/CircuitBreaker.html",
      },
    ],
    architecturalBlueprint: {
      overview: "API Gateway tier intercepting all public mobile and web traffic, enforcing rate limit quotas and circuit breaking before forwarding to internal RPC microservices.",
      capacityMath: "10,000 incoming req/sec -> Evaluated in <0.5ms via local memory filter or Redis cluster -> 9,800 forwarded; 200 rate-limited (HTTP 429).",
      coreComponents: [
        "Authentication Filter (Validates asymmetric RS256 JWT tokens without DB lookup)",
        "Rate Limiter Filter (Evaluates token bucket tokens using atomic Redis Lua scripts)",
        "Service Discovery Registry (Consul / Eureka dynamically tracking active pod IPs)",
        "Circuit Breaker Controller (Trips open upon 50% HTTP 5xx errors to prevent cascades)",
      ],
      tradeOffs: "A centralized API gateway introduces an additional network hop and can become a bottleneck if heavy business logic is mistakenly embedded inside it.",
    },
  },
  {
    id: "sd_fund_10",
    trackId: "fundamentals",
    levelNumber: 10,
    title: "Distributed Object Storage (Amazon S3 Architecture)",
    shortTitle: "Object Storage & S3",
    tag: "SPECIALIZED",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Block vs File vs Object storage, immutable blob storage, metadata/data plane separation, multi-part parallel uploads, 11 nines durability, and Erasure Coding.",
    x: 78,
    y: 1520,
    youtubeVideoId: "abbjd7bccLE",
    videoTitle: "Architecting Amazon S3: Designing Scalable and Durable Object Storage | System Design Interview",
    videoChannel: "ByteByteGo",
    videoDuration: "11:22",
    keyTakeaways: [
      "Object Storage Model: Stores unstructured data as atomic objects identified by unique key strings; flat namespace with zero nested filesystem directory locks.",
      "Separation of Metadata and Data: Fast distributed database (e.g. DynamoDB/Spanner) indexes bucket/key metadata; chunk storage servers store raw binary byte streams.",
      "Erasure Coding (Reed-Solomon): Splits file into k data chunks and m parity chunks; can reconstruct entire object from any k chunks with far less storage overhead than 3x replication.",
      "Multi-Part Upload: Large files (100MB - 5TB) split into 5MB chunks uploaded concurrently; network failures only require re-uploading individual failed parts.",
    ],
    resources: [
      {
        title: "Amazon S3: 11 Nines of Durability Explained",
        type: "Guide",
        description: "Official AWS whitepaper on erasure coding, cross-AZ checksum verification, and silent bitrot recovery.",
        url: "https://aws.amazon.com/s3/storage-classes/",
      },
      {
        title: "MinIO: High Performance Object Storage Architecture",
        type: "Guide",
        description: "Open-source S3-compatible architecture explaining SIMD accelerated erasure coding and bitrot healing.",
        url: "https://min.io/docs/minio/linux/operations/concepts/erasure-coding.html",
      },
    ],
    architecturalBlueprint: {
      overview: "Infinite scale object store storing petabytes of images, videos, and backups with 99.999999999% (11 9s) annual data durability.",
      capacityMath: "1 Petabyte Data | 3x Replication requires 3PB raw disk. Erasure Coding (8+4): Requires only 1.5PB raw disk while tolerating 4 simultaneous disk crashes.",
      coreComponents: [
        "API Gateway (Authenticates presigned URLs and routes chunk uploads)",
        "Metadata Service (High-speed distributed KV store indexing bucket/key -> chunk IDs)",
        "Storage Node Fleet (Commodity servers writing raw byte chunks directly to raw disk)",
        "Background Garbage Collector & Bitrot Scrubber (Continuously verifies SHA-256 hashes)",
      ],
      tradeOffs: "Objects are immutable; updating a single byte in a 5GB file requires rewriting the entire object or managing custom append deltas.",
    },
  },
];

// -------------------------------------------------------------
// TRACK 2: Real-World Case Studies & Practice Problems (10 Levels)
// -------------------------------------------------------------
const PRACTICE_PROBLEMS_LEVELS: SystemDesignLevel[] = [
  {
    id: "sd_prac_1",
    trackId: "practice_problems",
    levelNumber: 1,
    title: "Design a URL Shortener (TinyURL / Bitly)",
    shortTitle: "TinyURL",
    tag: "CASE STUDY",
    difficulty: "Beginner",
    estimatedMinutes: 50,
    description:
      "High read-to-write ratio (100:1), Base62 encoding, hash collision resolution vs offline Key Generation Service (KGS), and low-latency Redis caching.",
    x: 50,
    y: 80,
    youtubeVideoId: "fMZMm_0ZhK4",
    videoTitle: "System Design : Design a service like TinyUrl",
    videoChannel: "Gaurav Sen",
    videoDuration: "18:22",
    keyTakeaways: [
      "Base62 Encoding: Uses [A-Z, a-z, 0-9]. A 7-character string yields 62^7 = 3.5 Trillion unique short URLs, enough for decades of high-volume creation.",
      "Key Generation Service (KGS): Pre-generates unique 7-character random strings offline and loads them into a fast token pool, completely eliminating runtime hash collision queries.",
      "HTTP 301 vs 302 Redirect: 301 (Moved Permanently) is cached by browser, minimizing server load; 302 (Found / Temporary) forces every request through server, enabling accurate click analytics.",
      "Caching Strategy: Cache the top 20% most active URLs in Redis (80/20 Pareto principle) to satisfy 80% of read traffic in <1ms without database queries.",
    ],
    resources: [
      {
        title: "ByteByteGo: Design TinyURL In-Depth Guide",
        type: "Guide",
        description: "Complete walkthrough covering schema, Base62 encoding, and KGS token concurrency.",
        url: "https://bytebytego.com/courses/system-design-interview/design-a-url-shortener",
      },
      {
        title: "Bitly Engineering: How We Handle Billions of Clicks",
        type: "Engineering Blog",
        description: "Real-world infrastructure lessons from Bitly's distributed link redirection platform.",
        url: "https://bitly.com/blog/",
      },
    ],
    architecturalBlueprint: {
      overview: "URL Shortener architecture separating write link creation from ultra-high-throughput cached read redirects.",
      capacityMath: "100M URLs created/month -> 40 writes/sec | 100:1 read ratio -> 4,000 read QPS | 5-year storage: 100M * 12 * 5 * 500 bytes = 3 TB total storage.",
      apiEndpoints: [
        "POST /api/v1/urls (Body: { long_url: string, custom_alias?: string }) -> Returns: { short_url: string }",
        "GET /{short_code} -> Returns: HTTP 302 Redirect with Location header",
      ],
      coreComponents: [
        "API Gateway & Load Balancer",
        "URL Shortening App Workers (Stateless)",
        "Key Generation Service (KGS) backed by ZooKeeper token locks",
        "Redis Distributed Cache Cluster (80/20 active URLs)",
        "PostgreSQL / DynamoDB primary persistence (Mapping: short_code -> long_url, user_id, created_at)",
      ],
      tradeOffs: "Choosing 302 temporary redirects increases analytics telemetry precision at the cost of routing every click through your infrastructure.",
    },
  },
  {
    id: "sd_prac_2",
    trackId: "practice_problems",
    levelNumber: 2,
    title: "Design a Distributed Rate Limiter",
    shortTitle: "Rate Limiter",
    tag: "CASE STUDY",
    difficulty: "Intermediate",
    estimatedMinutes: 55,
    description:
      "Per-user / per-IP rate limits, Token Bucket vs Sliding Window Counter, distributed concurrency race condition mitigation using Redis Lua scripts.",
    x: 78,
    y: 240,
    youtubeVideoId: "FU4WlwfS3G0",
    videoTitle: "System Design Interview - Rate Limiting (local and distributed)",
    videoChannel: "ByteByteGo",
    videoDuration: "14:50",
    keyTakeaways: [
      "Sliding Window Counter: Combines simplicity of fixed window with accuracy of sliding log; calculates request count as: Requests in current window + (Requests in previous window * overlap %).",
      "Atomic Redis Lua Execution: Reading a counter and incrementing it across distributed threads causes race conditions; executing the algorithm in a Redis Lua script guarantees atomicity.",
      "Response Headers: Return X-Ratelimit-Remaining, X-Ratelimit-Limit, and X-Ratelimit-Retry-After (HTTP 429 Too Many Requests).",
      "Multi-Tier Limits: Enforce fast IP rate limiting at edge CDN / Cloudflare; enforce authenticated user_id rate limits inside the internal API gateway.",
    ],
    resources: [
      {
        title: "Stripe: Scaling Your API with Rate Limiters",
        type: "Engineering Blog",
        description: "How Stripe implemented load shedding, concurrency limiters, and token bucket algorithms.",
        url: "https://stripe.com/blog/rate-limiters",
      },
      {
        title: "Figma: An Alternative Approach to Rate Limiting",
        type: "Engineering Blog",
        description: "Figma's implementation of sliding window rate limiting using Redis and Envoy proxy.",
        url: "https://www.figma.com/blog/an-alternative-approach-to-rate-limiting/",
      },
    ],
    architecturalBlueprint: {
      overview: "Centralized rate limiting middleware inspecting incoming HTTP requests and rejecting excess traffic with HTTP 429 before backend services are impacted.",
      capacityMath: "100k requests/sec | Per-user memory: 20 bytes in Redis -> 10M active users require only ~200MB of RAM in Redis.",
      apiEndpoints: [
        "Middleware Header Check: Returns HTTP 429 Too Many Requests with Retry-After header when bucket is empty.",
      ],
      coreComponents: [
        "Envoy / Kong API Gateway Middleware Layer",
        "Redis Cluster hosting sliding window sorted sets and token counters",
        "Rules Engine (Defines limits per endpoint: /login 5/min, /search 60/min)",
        "Analytics & Alerting Pipeline (Monitors DDoS spikes and IP blocks)",
      ],
      tradeOffs: "Local in-memory rate limiting has zero latency but doesn't coordinate across nodes; centralized Redis coordinates globally with sub-millisecond latency.",
    },
  },
  {
    id: "sd_prac_3",
    trackId: "practice_problems",
    levelNumber: 3,
    title: "Design Twitter / X (Newsfeed Timeline System)",
    shortTitle: "Twitter Newsfeed",
    tag: "CASE STUDY",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "300M DAU, Fan-out on write (push model) vs Fan-out on read (pull model), celebrity user handling, hybrid timeline aggregation, and Redis caching.",
    x: 50,
    y: 400,
    youtubeVideoId: "Ch_IBiQvZ-c",
    videoTitle: "How to Design API during interview | Twitter | System Design",
    videoChannel: "Gaurav Sen",
    videoDuration: "16:45",
    keyTakeaways: [
      "Fan-Out on Write (Push): When a user tweets, background workers inject tweet_id into the home timeline Redis list of all their followers. Reads are instantaneous O(1), but writing for celebrities with 100M followers freezes workers.",
      "Fan-Out on Read (Pull): Follower fetches tweets on the fly from all followed accounts and merges them. Writes are O(1), but read queries become slow and expensive.",
      "Hybrid Solution: Normal users (<20k followers) use Fan-out on write; Celebrity accounts (>20k followers) use Fan-out on read. The timeline service merges both streams in memory upon user login.",
      "Timeline Cache: Store top 800 tweet IDs per active user in a Redis linked list / sorted set; fetch actual tweet text/media from tweet store only for rendered viewport.",
    ],
    resources: [
      {
        title: "Twitter: The Architecture Twitter Uses to Deal with 150M Active Users",
        type: "Engineering Blog",
        description: "Detailed breakdown of Timeline Service (TimelineQueryService) and Redis cache clusters.",
        url: "https://blog.x.com/engineering/en_us/topics/infrastructure/2017/the-infrastructure-behind-twitter-scale",
      },
      {
        title: "High Scalability: How Twitter Stores and Serves Millions of Tweets",
        type: "Article",
        description: "Storage architectures behind Snowflake ID generation and tweet fan-out queues.",
        url: "http://highscalability.com/blog/2013/7/8/the-architecture-twitter-uses-to-deal-with-150m-active-users.html",
      },
    ],
    architecturalBlueprint: {
      overview: "Hybrid fan-out newsfeed pipeline maintaining pre-computed timeline caches for active users while pulling celebrity tweets dynamically.",
      capacityMath: "300M DAU | 500M tweets/day -> 6k tweets/sec write | 300k timeline read QPS -> 50:1 read to write ratio.",
      apiEndpoints: [
        "POST /api/v1/tweets (Body: { text: string, media_ids: string[] }) -> Returns: { tweet_id: string }",
        "GET /api/v1/feed/home (Query: { cursor?: string, limit?: number }) -> Returns: { tweets: Tweet[] }",
      ],
      coreComponents: [
        "Tweet Ingestion Service (Generates 64-bit Snowflake IDs, writes to Cassandra)",
        "Fan-out Worker Cluster (Consumes Kafka event, fans out tweet_id to follower Redis lists)",
        "Social Graph Service (FlockDB / Neo4j tracking follower/following edges)",
        "Timeline Cache Service (Redis clusters storing user home timeline lists)",
      ],
      tradeOffs: "Pre-computing timelines wastes storage for inactive users; only maintain timeline caches for users who have opened the app within the last 14 days.",
    },
  },
  {
    id: "sd_prac_4",
    trackId: "practice_problems",
    levelNumber: 4,
    title: "Design Netflix / YouTube (Video Streaming at Scale)",
    shortTitle: "Netflix / YouTube",
    tag: "CASE STUDY",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Video ingestion pipeline, chunked distributed transcoding, adaptive bitrate streaming (DASH / HLS), S3 object storage, and ISP edge CDN delivery (OpenConnect).",
    x: 22,
    y: 560,
    youtubeVideoId: "x9Hrn0oNmJM",
    videoTitle: "How NETFLIX onboards new content: Video Processing at scale 🎥",
    videoChannel: "Gaurav Sen",
    videoDuration: "15:20",
    keyTakeaways: [
      "Chunked Video Transcoding: Raw master video files (hundreds of gigabytes) are sliced into 5-10 second chunks and transcoded in parallel across thousands of worker nodes.",
      "Adaptive Bitrate Streaming (ABR): Encodes video into multiple bitrates and resolutions (1080p, 720p, 480p) using HLS (HTTP Live Streaming) or MPEG-DASH. Client player dynamically switches bitrate based on measured network bandwidth.",
      "OpenConnect CDN Appliance: Netflix installs custom hardware caching appliances directly inside ISP datacenters worldwide, serving 95%+ of video traffic locally without traversing internet backbones.",
      "Database Polyglot: Video metadata and user playback history are stored in Cassandra; recommendation graphs reside in specialized graph databases.",
    ],
    resources: [
      {
        title: "Netflix TechBlog: High Quality Video Encoding at Scale",
        type: "Engineering Blog",
        description: "Deep dive into Netflix Archer encoding pipeline and dynamic chunk allocation.",
        url: "https://netflixtechblog.com/",
      },
      {
        title: "How OpenConnect Powers Netflix Streaming",
        type: "Guide",
        description: "Official Netflix OpenConnect CDN architecture and peering appliance deployment guide.",
        url: "https://openconnect.netflix.com/en/",
      },
    ],
    architecturalBlueprint: {
      overview: "Dual-plane architecture: AWS cloud control plane manages user accounts, metadata, and video encoding; OpenConnect edge CDN appliances deliver streaming bytes.",
      capacityMath: "200M subscribers | 20M concurrent streams @ 3 Mbps average = 60 Terabits/second aggregate outbound network bandwidth.",
      apiEndpoints: [
        "POST /api/v1/videos/upload (Multipart upload to S3)",
        "GET /api/v1/videos/{id}/manifest.m3u8 (Fetches HLS adaptive bitrate manifest)",
      ],
      coreComponents: [
        "Raw Video Storage (Amazon S3 bucket for master uncompressed files)",
        "Transcoding Engine (Distributed workers splitting video into 6-second segments)",
        "Metadata DB (Cassandra storing video title, tags, actors, and viewing history)",
        "Edge CDN Appliances (OpenConnect / Cloudflare caching video chunks near users)",
      ],
      tradeOffs: "Transcoding into 20+ codec/bitrate profiles consumes immense computational power upfront but minimizes buffering latency and bandwidth costs for billions of viewers.",
    },
  },
  {
    id: "sd_prac_5",
    trackId: "practice_problems",
    levelNumber: 5,
    title: "Design WhatsApp / Messenger (Real-Time Chat)",
    shortTitle: "WhatsApp Chat",
    tag: "CASE STUDY",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "2 Billion users, persistent bi-directional WebSockets, session registry, transient message queues, offline store-and-forward, read receipts, and E2E encryption.",
    x: 50,
    y: 720,
    youtubeVideoId: "vvhC64hQZMk",
    videoTitle: "WHATSAPP System Design: Chat Messaging Systems for Interviews",
    videoChannel: "Gaurav Sen",
    videoDuration: "19:12",
    keyTakeaways: [
      "Persistent WebSocket Connections: Mobile clients maintain long-lived stateful TCP/WebSocket connections to chat gateway servers, eliminating HTTP polling overhead.",
      "Session Registry: Redis cluster maps active user_id -> specific Chat Gateway Host ID. When User A sends to User B, gateway queries Redis to route message to User B's open socket.",
      "Store-and-Forward for Offline Users: If recipient is offline, message is saved in a transient database (Cassandra / HBase). Once recipient reconnects, pending messages are delivered and immediately deleted from server.",
      "Message Status Pipeline: Sent (Single Checkmark) -> Delivered to Device (Double Grey Checkmark) -> Read by Recipient (Double Blue Checkmark) updated via lightweight ACK packets.",
    ],
    resources: [
      {
        title: "WhatsApp: 1 Million Connections per Erlang Node",
        type: "Engineering Blog",
        description: "How WhatsApp tuned FreeBSD and Erlang BEAM to hold 2.8M concurrent TCP connections on a single machine.",
        url: "https://www.erlang-factory.com/upload/presentations/558/efsf2012-whatsapp-scaling.pdf",
      },
      {
        title: "Signal Protocol: End-to-End Cryptography Specification",
        type: "Paper",
        description: "The Double Ratchet algorithm and pre-shared cryptographic key bundles used in WhatsApp and Signal.",
        url: "https://signal.org/docs/specifications/doubleratchet/",
      },
    ],
    architecturalBlueprint: {
      overview: "Real-time communication topology with WebSocket gateways, in-memory session mapping, and transient message queues.",
      capacityMath: "2 Billion users | 500M DAU | 100 Billion messages/day = 1.15 Million messages/second peak.",
      apiEndpoints: [
        "WebSocket protocol: { type: 'chat_message', to: 'user_456', payload: 'encrypted_bytes', id: 'msg_789' }",
        "ACK protocol: { type: 'msg_ack', id: 'msg_789', status: 'delivered' | 'read' }",
      ],
      coreComponents: [
        "Chat WebSocket Gateway Fleet (Maintains active TCP connections using epoll/kqueue)",
        "User Session Registry (Redis mapping user_id -> gateway_server_ip)",
        "Transient Message Store (Cassandra table holding unread messages with short TTL)",
        "Group Message Service (Fans out group messages to members via message queue)",
      ],
      tradeOffs: "Storing messages on server allows seamless multi-device history sync (Slack/Telegram) but increases server liability; WhatsApp deletes messages immediately after delivery to guarantee privacy.",
    },
  },
  {
    id: "sd_prac_6",
    trackId: "practice_problems",
    levelNumber: 6,
    title: "Design Uber / Grab (Location-Based Dispatch Service)",
    shortTitle: "Uber Dispatch",
    tag: "CASE STUDY",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Real-time driver location tracking every 4s, spatial indexing (Geohash vs QuadTree vs Uber H3 hexagonal grid), nearby driver search, and trip dispatch matching.",
    x: 78,
    y: 880,
    youtubeVideoId: "M4lR_Va97cQ",
    videoTitle: "FAANG System Design Interview: Design A Location Based Service (Yelp, Google Places)",
    videoChannel: "ByteByteGo",
    videoDuration: "14:10",
    keyTakeaways: [
      "Spatial Indexing Necessity: Standard SQL indexing on (latitude, longitude) requires full-table 2D range scans; geospatial indexing maps 2D coordinates into a 1D searchable key.",
      "Geohash & QuadTrees: Geohash divides the world into hierarchical bounding boxes encoded as base32 strings (matching prefixes indicate spatial proximity); QuadTrees recursively partition cells into 4 quadrants.",
      "Uber H3 Hexagonal Grid: Hexagons have equal distance to all 6 neighboring cells (unlike squares which have diagonal corners), simplifying radial trajectory matching.",
      "Location Update Stream: Drivers send GPS updates every 4 seconds via UDP/WebSocket; updates bypass heavy databases and update an in-memory Redis geospatial buffer directly.",
    ],
    resources: [
      {
        title: "Uber Engineering: H3 Hexagonal Hierarchical Spatial Index",
        type: "Engineering Blog",
        description: "Open-source geospatial discrete global grid system designed for ride-hailing dispatch.",
        url: "https://www.uber.com/blog/h3/",
      },
      {
        title: "Uber Engineering: Designing Ringpop and Dispatch Services",
        type: "Engineering Blog",
        description: "Consistent hash rings and cooperative distributed matching architectures.",
        url: "https://www.uber.com/blog/scaling-ubers-real-time-dispatch-platform/",
      },
    ],
    architecturalBlueprint: {
      overview: "High-frequency location ingestion pipeline feeding in-memory spatial indexes to perform sub-100ms radius driver searches.",
      capacityMath: "1M active drivers sending GPS every 4 seconds = 250,000 GPS writes/second | Handled via in-memory Redis cluster partitioned by geohash prefix.",
      apiEndpoints: [
        "POST /api/v1/driver/location (Body: { driver_id: string, lat: float, lng: float, timestamp: number })",
        "POST /api/v1/riders/request-ride (Body: { pickup_lat: float, pickup_lng: float, dropoff_lat: float, dropoff_lng: float })",
      ],
      coreComponents: [
        "Location Ingestion Gateway (High-throughput Netty / Go WebSocket servers)",
        "Location Storage Service (Redis GEOADD / in-memory H3 spatial cell mapping)",
        "Dispatch Matcher (Finds top-5 closest available drivers within 5km, evaluates ETA)",
        "Trip Management Service (PostgreSQL storing ride state machine: Requested -> Dispatched -> Completed)",
      ],
      tradeOffs: "Updating QuadTrees in memory on every 4-second GPS ping causes excessive rebalancing lock contention; batching location updates in Redis sorted sets solves lock issues.",
    },
  },
  {
    id: "sd_prac_7",
    trackId: "practice_problems",
    levelNumber: 7,
    title: "Design a Distributed Web Crawler (Google / Bing)",
    shortTitle: "Web Crawler",
    tag: "CASE STUDY",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "1 Billion pages/month, URL Frontier priority and politeness queues, Bloom Filters for deduplication, HTML parsing, DNS resolution caching, and robots.txt parsing.",
    x: 50,
    y: 1040,
    youtubeVideoId: "6u25GckPhLU",
    videoTitle: "Design a Web Crawler: FAANG Interview Question",
    videoChannel: "ByteByteGo",
    videoDuration: "12:45",
    keyTakeaways: [
      "URL Frontier: Central scheduling component that balances Politeness (avoiding DDoS on target websites by pausing between requests) and Priority (crawling high PageRank domains first).",
      "Two-Queue Frontier Architecture: Priority queues (F1...Fn) sort URLs by domain importance; Politeness queues (B1...Bn) map URLs by hostname to ensure a host is only fetched by one worker at a time.",
      "Bloom Filter Deduplication: A probabilistic bit-array test checks if a URL has already been visited in O(1) time and negligible memory, with 0% false negatives.",
      "Content Fingerprinting: Uses SimHash to detect near-duplicate web pages (e.g. mirror sites or identical articles with different ads) without storing raw HTML.",
    ],
    resources: [
      {
        title: "Mercator: A Scalable, Extensible Web Crawler (Heydon & Najork)",
        type: "Paper",
        description: "The seminal research paper on politeness queues and URL frontier design adopted by Google and AltaVista.",
        url: "https://www.hpl.hp.com/techreports/Compaq-DEC/SRC-RR-166.pdf",
      },
      {
        title: "Bloom Filters by Example",
        type: "Guide",
        description: "Interactive visual tutorial on hash functions, optimal bit-array size, and collision math.",
        url: "https://hur.st/bloomfilter/",
      },
    ],
    architecturalBlueprint: {
      overview: "Massively parallel crawler workers fed by a polite URL Frontier, downloading HTML, extracting links, and writing clean documents to distributed storage.",
      capacityMath: "1 Billion pages/month = 400 pages/second | Average page size: 500KB = 200 MB/sec network ingestion bandwidth | 500 TB storage/month.",
      apiEndpoints: [
        "Internal Queue Consumer: Fetches next polite URL from Frontier, verifies robots.txt, downloads HTML, extracts URLs, and enqueues children.",
      ],
      coreComponents: [
        "URL Frontier (Host-polite queue with Redis / Kafka coordination)",
        "DNS Caching Resolver (Avoids DNS lookup latency bottleneck)",
        "HTML Fetcher & Parser Workers (Asynchronous headless fetchers)",
        "Bloom Filter & SimHash Deduplicator (Prevents crawl loops and identical pages)",
        "Document Storage Store (Amazon S3 / Bigtable storing raw and parsed content)",
      ],
      tradeOffs: "Crawling too fast violates webmaster robots.txt and triggers IP bans; crawling too slow means search indices become stale.",
    },
  },
  {
    id: "sd_prac_8",
    trackId: "practice_problems",
    levelNumber: 8,
    title: "Design Google Drive / Dropbox (File Sync Service)",
    shortTitle: "Google Drive Sync",
    tag: "CASE STUDY",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Chunking files into 4MB blocks, SHA-256 content-addressable deduplication, differential delta upload sync, local SQLite state, and long-polling notification service.",
    x: 22,
    y: 1200,
    youtubeVideoId: "3RHjRXWAUvg",
    videoTitle: "Google Drive System Design | Dropbox System Design | File Sharing Service System Design",
    videoChannel: "ByteByteGo",
    videoDuration: "14:15",
    keyTakeaways: [
      "Chunking & Content Deduplication: Files are split into fixed 4MB chunks and hashed with SHA-256. If another user already uploaded an identical chunk, your client skips uploading it entirely.",
      "Delta Sync: When a user edits a 500MB video, only the specific 4MB chunks that were modified are uploaded to S3, reducing upload bandwidth by 99%.",
      "Local Metadata Synchronization: Client maintains a local SQLite database tracking chunk hashes and local modification timestamps; compares against cloud state to detect conflicts.",
      "Notification Service: Long-polling or WebSocket connections notify other client devices immediately when a collaborator makes a file edit in a shared folder.",
    ],
    resources: [
      {
        title: "Dropbox: How We Scaled Dropbox from Hundreds to Millions of Users",
        type: "Engineering Blog",
        description: "Architecture breakdown of chunking engines, S3 migration, and Magic Pocket exabyte storage.",
        url: "https://dropbox.tech/infrastructure/how-we-built-magic-pocket-dropboxs-multi-exabyte-storage-system",
      },
      {
        title: "Rsync Algorithm (Andrew Tridgell)",
        type: "Paper",
        description: "The mathematical foundation of rolling checksums and differential binary syncing.",
        url: "https://rsync.samba.org/tech_report/",
      },
    ],
    architecturalBlueprint: {
      overview: "Sync architecture balancing local desktop clients with block storage servers, delta upload processors, and metadata change notifications.",
      capacityMath: "50M users | 10GB free tier = 500 Petabytes total storage | Chunk deduplication typically saves 30-40% of disk space.",
      apiEndpoints: [
        "POST /api/v1/files/upload-session (Initiates multi-part chunk upload session)",
        "POST /api/v1/files/chunk (Body: { chunk_hash: string, bytes: blob })",
        "GET /api/v1/files/sync-events (Long-polling stream of file tree changes)",
      ],
      coreComponents: [
        "Desktop Client Sync Engine (Chunks files, computes SHA-256, monitors FS events)",
        "Block Storage Service (Amazon S3 / custom object store saving raw 4MB blocks)",
        "Metadata DB Tier (PostgreSQL / CockroachDB saving file tree, permissions, chunk maps)",
        "Notification Gateway (Redis Pub/Sub triggering WebSockets to connected user devices)",
      ],
      tradeOffs: "Automatic merge conflict resolution can overwrite collaborator work; keeping conflict branches (e.g. 'myfile (conflicted copy)') prevents silent data loss.",
    },
  },
  {
    id: "sd_prac_9",
    trackId: "practice_problems",
    levelNumber: 9,
    title: "Design a Distributed Key-Value Store (Dynamo-Style)",
    shortTitle: "Dynamo KV Store",
    tag: "SPECIALIZED",
    difficulty: "Advanced",
    estimatedMinutes: 65,
    description:
      "Consistent hashing ring with virtual nodes, tunable consistency (Quorum W + R > N), vector clocks for concurrent conflict resolution, and gossip failure detection.",
    x: 50,
    y: 1360,
    youtubeVideoId: "oRP2maBphfs",
    videoTitle: "Design Key Value Store | Data Partition | System Design Interview Question",
    videoChannel: "ByteByteGo",
    videoDuration: "13:20",
    keyTakeaways: [
      "Masterless Distributed Architecture: Every node in the cluster plays an identical role; there is no single master node to fail or bottleneck writes.",
      "Tunable Consistency Quorums: Configurable parameters N (total replicas), W (write quorum), R (read quorum). Setting W=1, R=1 optimizes for blazing speed; W=2, R=2 ensures strong consistency.",
      "Vector Clocks: Captures causal relationships between concurrent modifications on different nodes; detects conflicting branching writes for application-level reconciliation.",
      "Gossip Protocol & Hinted Handoff: Nodes exchange heartbeats randomly with peers to detect host failures in decentralized fashion; healthy nodes buffer writes temporarily for down peers.",
    ],
    resources: [
      {
        title: "Amazon Dynamo Paper (DeCandia et al. SOSP 2007)",
        type: "Paper",
        description: "The seminal distributed systems paper that inspired Apache Cassandra, Riak, and DynamoDB.",
        url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
      },
      {
        title: "Apache Cassandra Architecture Overview",
        type: "Guide",
        description: "SSTables, Memtables, Commit Logs, and Gossip protocols implemented in production.",
        url: "https://cassandra.apache.org/_/cassandra-basics.html",
      },
    ],
    architecturalBlueprint: {
      overview: "Peer-to-peer ring topology delivering sub-10ms reads and writes under extreme horizontal scale and network partition tolerance.",
      capacityMath: "100 Nodes | N=3 replication | W=2, R=2 quorum | 100k write QPS distributed evenly across 100 nodes = 1,000 writes/sec per host.",
      apiEndpoints: [
        "PUT /api/v1/store (Body: { key: string, value: bytes, context?: VectorClock })",
        "GET /api/v1/store/{key} -> Returns: { value: bytes, context: VectorClock }",
      ],
      coreComponents: [
        "Coordinator Node (Selected randomly to orchestrate read/write quorum)",
        "Consistent Hash Ring (Determines the N physical hosts responsible for key)",
        "LSM-Tree Engine (Memtable RAM write buffer + immutable on-disk SSTables)",
        "Anti-Entropy Scrubber (Uses Merkle trees to detect and repair out-of-sync replicas)",
      ],
      tradeOffs: "Masterless architecture guarantees 100% write availability, but reading during partitions requires vector clock conflict reconciliation in client business logic.",
    },
  },
  {
    id: "sd_prac_10",
    trackId: "practice_problems",
    levelNumber: 10,
    title: "Step-by-Step Senior Engineer Interview Blueprint",
    shortTitle: "Interview Blueprint",
    tag: "SPECIALIZED",
    difficulty: "Advanced",
    estimatedMinutes: 60,
    description:
      "Mastering the 45-minute FAANG System Design Interview: time allocation, driving the whiteboard, handling ambiguous requirements, and discussing trade-offs.",
    x: 78,
    y: 1520,
    youtubeVideoId: "bUHFg8CZFws",
    videoTitle: "System Design Interview – Step By Step Guide",
    videoChannel: "ByteByteGo",
    videoDuration: "09:30",
    keyTakeaways: [
      "Time Management (45-Minute Breakdown): 1. Scope & Requirements (5 mins), 2. High-Level Architecture (10-15 mins), 3. Deep-Dive Specific Components (15-20 mins), 4. Bottlenecks & Wrap-Up (5 mins).",
      "Drive the Conversation: Do NOT wait for the interviewer to prompt you. Proactively state your assumptions, outline options, evaluate trade-offs, and recommend a concrete path forward.",
      "Red Flags to Avoid: Jumping straight into database schemas without understanding read/write traffic ratios; proposing complex distributed systems (Kafka, Cassandra) for small workloads that fit on a single Postgres box.",
      "Trade-Off Articulation: Always frame design decisions as trade-offs (e.g. 'We could use Cache-Aside which is simple, or Write-Through which guarantees freshness at the expense of higher write latency').",
    ],
    resources: [
      {
        title: "Alex Xu: System Design Interview Vol 1 & 2",
        type: "Book",
        description: "The gold-standard interview prep manual with real question walkthroughs and diagrams.",
        url: "https://bytebytego.com/",
      },
      {
        title: "Gaurav Sen: System Design Interview Blueprint",
        type: "Guide",
        description: "Common behavioral expectations and architectural rubric breakdowns for Staff+ engineering levels.",
        url: "https://gkcs.in/",
      },
    ],
    architecturalBlueprint: {
      overview: "Universal 4-phase whiteboard blueprint for systematically answering any ambiguous system design prompt.",
      capacityMath: "45 minutes: Phase 1 (5m Scope) -> Phase 2 (10m High-Level) -> Phase 3 (25m Deep Dives) -> Phase 4 (5m Bottlenecks & Resiliency).",
      coreComponents: [
        "Requirements Matrix (Functional list + Non-functional metrics SLA/SLO)",
        "Envelope Estimator (Calculates QPS, Storage per year, RAM for caching)",
        "Architecture Canvas (Client -> CDN -> Gateway -> App -> Cache -> DB -> Bus)",
        "Failure Mode Analysis (Failover plans for Master DB, Redis down, Network split)",
      ],
      tradeOffs: "Simple architectures that scale to 10M users with PostgreSQL and Redis are favored over over-engineered microservices clusters that add operational complexity.",
    },
  },
];

export const SYSTEM_DESIGN_TRACKS: SystemDesignTrackMeta[] = [
  {
    id: "fundamentals",
    title: "A to Z System Design Fundamentals",
    shortTitle: "A-to-Z Fundamentals",
    tagline: "Core Distributed Building Blocks & Theoretical Foundations",
    description:
      "Latency numbers, load balancers, consistent hashing, caching strategies, SQL vs NoSQL, sharding, distributed consensus (CAP & Raft), Kafka, API gateways, and object storage.",
    icon: Network,
    levels: FUNDAMENTALS_LEVELS,
  },
  {
    id: "practice_problems",
    title: "Architecture Practice Problems & Case Studies",
    shortTitle: "Practice Problems",
    tagline: "Real-World FAANG Case Studies with Video Walkthroughs",
    description:
      "TinyURL, Rate Limiter, Twitter Newsfeed, Netflix Streaming, WhatsApp Chat, Uber Dispatch, Web Crawler, Google Drive Sync, Dynamo KV Store, and Interview Blueprint.",
    icon: Workflow,
    levels: PRACTICE_PROBLEMS_LEVELS,
  },
];

const STORAGE_KEY_SD_COMPLETED = "interviewai_system_design_completed_topics";

export const SystemDesignView: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [primaryTab, setPrimaryTab] = useState<"curriculum" | "canvas">("curriculum");
  const [activeTrackId, setActiveTrackId] = useState<SystemDesignTrackId>("fundamentals");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<SystemDesignLevel | null>(null);
  const [modalTab, setModalTab] = useState<"video" | "blueprint" | "resources">("video");
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  // Load completed topics from localStorage & sync from backend
  useEffect(() => {
    setMounted(true);
    let localCompleted: Record<string, boolean> = {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SD_COMPLETED);
      if (stored) {
        localCompleted = JSON.parse(stored);
        setCompletedTopics(localCompleted);
      }
    } catch {
      // Fallback
    }

    // Sync from FastAPI PostgreSQL backend
    fetchBackendProgress().then((summary) => {
      if (summary && summary.system_design) {
        setCompletedTopics((prev) => {
          const merged = { ...prev };
          summary.system_design.forEach((id) => {
            merged[id] = true;
          });
          try {
            localStorage.setItem(STORAGE_KEY_SD_COMPLETED, JSON.stringify(merged));
          } catch {
            // Fallback
          }
          return merged;
        });
      }
    });
  }, []);

  // Save completed topics to localStorage and persist to backend
  const toggleTopicCompletion = (levelId: string) => {
    const isCurrentlyDone = !!completedTopics[levelId];
    const nextDoneState = !isCurrentlyDone;

    setCompletedTopics((prev) => {
      const updated = { ...prev, [levelId]: nextDoneState };
      try {
        localStorage.setItem(STORAGE_KEY_SD_COMPLETED, JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });

    // Find topic metadata across tracks
    const matchedLevel = SYSTEM_DESIGN_TRACKS.flatMap((t) => t.levels).find((lvl) => lvl.id === levelId);
    recordProgressToggle(
      "system_design",
      levelId,
      nextDoneState,
      matchedLevel?.title || `System Design Topic ${levelId}`,
      matchedLevel?.difficulty || "Intermediate"
    );
  };

  const activeTrack = useMemo(() => {
    return SYSTEM_DESIGN_TRACKS.find((t) => t.id === activeTrackId) || SYSTEM_DESIGN_TRACKS[0];
  }, [activeTrackId]);

  const filteredLevels = useMemo(() => {
    if (!searchQuery.trim()) return activeTrack.levels;
    const q = searchQuery.toLowerCase();
    return activeTrack.levels.filter(
      (lvl) =>
        lvl.title.toLowerCase().includes(q) ||
        lvl.description.toLowerCase().includes(q) ||
        lvl.keyTakeaways.some((k) => k.toLowerCase().includes(q))
    );
  }, [activeTrack, searchQuery]);

  const trackStats = useMemo(() => {
    const total = activeTrack.levels.length;
    const completed = activeTrack.levels.filter((l) => completedTopics[l.id]).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [activeTrack, completedTopics]);

  const overallStats = useMemo(() => {
    let total = 0;
    let completed = 0;
    SYSTEM_DESIGN_TRACKS.forEach((t) => {
      total += t.levels.length;
      completed += t.levels.filter((l) => completedTopics[l.id]).length;
    });
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [completedTopics]);

  // SVG winding path calculation
  const svgPathData = useMemo(() => {
    const points = activeTrack.levels.map((lvl) => ({
      x: (lvl.x / 100) * 800,
      y: lvl.y,
    }));

    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const cx1 = p1.x;
      const cy1 = (p1.y + p2.y) / 2;
      const cx2 = p2.x;
      const cy2 = (p1.y + p2.y) / 2;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [activeTrack]);

  return (
    <div className="space-y-6">
      {/* Top View Mode Switcher: Curriculum vs Architecture Canvas */}
      <div className="flex items-center justify-between gap-4 p-2 rounded-lg bg-[#111115] border border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPrimaryTab("curriculum")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              primaryTab === "curriculum"
                ? "bg-white text-zinc-950 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum & Deep Dives</span>
          </button>

          <button
            type="button"
            onClick={() => setPrimaryTab("canvas")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              primaryTab === "canvas"
                ? "bg-white text-zinc-950 shadow-xs"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Interactive Architecture Whiteboard</span>
            <span className="px-1.5 py-0.2 rounded-sm bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 text-[9px] font-mono font-medium">
              AI Review
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-400 font-mono">
          <span>{overallStats.completed}/{overallStats.total} Mastered</span>
        </div>
      </div>

      {primaryTab === "canvas" ? (
        <ArchitectureCanvas />
      ) : (
        <>
          {/* 1. Top Header Banner */}
          <div className="p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 border border-zinc-700/60">
                A to Z Engineering
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-900/40 text-[10px] font-mono">
                {overallStats.completed}/{overallStats.total} Overall Completed ({overallStats.percentage}%)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Network className="w-5 h-5 text-zinc-300" />
              <span>System Design & Distributed Architecture</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Comprehensive A-to-Z curriculum covering core distributed building blocks and real-world FAANG case studies with in-depth problem breakdown videos, capacity math, and architectural trade-offs.
            </p>
          </div>

          {/* Quick Track Switcher Cards */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {SYSTEM_DESIGN_TRACKS.map((track) => {
              const count = track.levels.filter((l) => completedTopics[l.id]).length;
              const isSelected = activeTrackId === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setActiveTrackId(track.id);
                    setSearchQuery("");
                  }}
                  className={`p-2.5 sm:p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "bg-zinc-800 border-zinc-700 shadow-xs"
                      : "bg-[#0e0e12] border-zinc-800/80 hover:border-zinc-700/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300">
                    <track.icon className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="hidden sm:inline">{track.shortTitle}</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-mono text-xs sm:text-sm font-semibold text-white">
                      {count}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      /{track.levels.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Track Segmented Control & Search */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#0e0e12] p-1 rounded-lg border border-zinc-800 overflow-x-auto">
            {SYSTEM_DESIGN_TRACKS.map((track) => {
              const Icon = track.icon;
              const isActive = activeTrackId === track.id;
              const doneCount = track.levels.filter((l) => completedTopics[l.id]).length;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setActiveTrackId(track.id);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{track.title}</span>
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-sm ${
                      doneCount === track.levels.length
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-900/60"
                        : "bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    {doneCount}/{track.levels.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search in ${activeTrack.shortTitle}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0e0e12] border border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Track Metadata Info */}
        <div className="p-3 rounded-md bg-[#0e0e12] border border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <activeTrack.icon className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-white font-medium">{activeTrack.tagline}:</span>
            <span className="text-zinc-400">{activeTrack.description}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-zinc-400 font-mono text-[11px]">
            <span>{trackStats.completed} of {trackStats.total} Completed ({trackStats.percentage}%)</span>
            <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${trackStats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Roadmap Canvas (SVG Winding Railway) */}
      <div className="relative w-full min-h-[1700px] rounded-lg bg-[#09090b] border border-zinc-800 overflow-hidden shadow-2xl">
        {/* Dark Grid Background Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Track Title Indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 rounded-md bg-[#111115] border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <Compass className="w-3.5 h-3.5 text-zinc-400" />
          <span>{activeTrack.title.toUpperCase()} MILESTONES</span>
        </div>

        {/* SVG Railway Track Rails */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 800 1680"
          preserveAspectRatio="none"
        >
          <path
            d={svgPathData}
            fill="none"
            className="roadmap-track-rail"
            stroke={isLight ? "#e2e8f0" : "#1c1917"}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d={svgPathData}
            fill="none"
            className="roadmap-track-dots"
            stroke={isLight ? "#475569" : "#27272a"}
            strokeWidth="2.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
        </svg>

        {/* Interactive Milestones */}
        <div className="relative z-10 w-full h-[1680px]">
          {filteredLevels.map((level) => {
            const isCompleted = !!completedTopics[level.id];
            const isSelected = selectedLevel?.id === level.id;

            return (
              <div
                key={level.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:scale-105"
                style={{
                  left: `${level.x}%`,
                  top: `${level.y}px`,
                }}
                onClick={() => {
                  setSelectedLevel(level);
                  setModalTab("video");
                }}
              >
                {/* Milestone Node */}
                <div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-200 ${
                    isCompleted
                      ? "bg-zinc-950 border-emerald-500 shadow-md shadow-emerald-950/40"
                      : isSelected
                      ? "bg-zinc-900 border-zinc-300 ring-2 ring-zinc-500/40"
                      : "bg-[#111115] border-zinc-700 hover:border-zinc-400 hover:bg-zinc-900"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <span className="font-mono font-bold text-sm text-zinc-100">
                      {level.levelNumber}
                    </span>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>

                {/* Milestone Title Label */}
                <div className="mt-2.5 flex flex-col items-center text-center max-w-[210px] pointer-events-none">
                  <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {level.shortTitle}
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-zinc-800 text-zinc-400 border border-zinc-750">
                      {level.tag}
                    </span>
                    {isCompleted ? (
                      <span className="text-[10px] font-mono text-emerald-400 font-medium">
                        Done
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {level.estimatedMinutes}m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Level Detail Modal Drawer */}
      {selectedLevel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedLevel(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#111115] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono font-medium text-zinc-300 border border-zinc-700/60">
                    Level {selectedLevel.levelNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700/60">
                    {activeTrack.shortTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-[10px] font-mono text-zinc-400">
                    {selectedLevel.difficulty}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {selectedLevel.estimatedMinutes} mins
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {selectedLevel.title}
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {selectedLevel.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleTopicCompletion(selectedLevel.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    completedTopics[selectedLevel.id]
                      ? "bg-emerald-950/50 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50"
                      : "bg-zinc-800 text-zinc-200 border-zinc-700/80 hover:bg-zinc-750 hover:text-white"
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      completedTopics[selectedLevel.id] ? "text-emerald-400" : "text-zinc-400"
                    }`}
                  />
                  <span>
                    {completedTopics[selectedLevel.id] ? "Marked as Done" : "Mark as Done"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLevel(null)}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Tabs: Video vs Architecture Blueprint vs Study Resources */}
            <div className="px-5 border-b border-zinc-800 flex items-center gap-4 text-xs font-medium bg-[#0e0e12]">
              <button
                type="button"
                onClick={() => setModalTab("video")}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
                  modalTab === "video"
                    ? "border-white text-white font-semibold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>
                  {activeTrackId === "practice_problems" ? "Problem Walkthrough Video" : "Concept Video"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("blueprint")}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
                  modalTab === "blueprint"
                    ? "border-white text-white font-semibold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>Architecture Blueprint & Math</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("resources")}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
                  modalTab === "resources"
                    ? "border-white text-white font-semibold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Engineering Papers & Blogs ({selectedLevel.resources.length})</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-5 custom-scrollbar text-xs">
              {/* TAB 1: Video Player & Takeaways */}
              {modalTab === "video" && (
                <div className="space-y-4">
                  <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black border border-zinc-800 shadow-md">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${selectedLevel.youtubeVideoId}?rel=0`}
                      title={selectedLevel.videoTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-md bg-[#0e0e12] border border-zinc-850">
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        {selectedLevel.videoTitle}
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Channel: {selectedLevel.videoChannel} | Duration: {selectedLevel.videoDuration}
                      </p>
                    </div>

                    <a
                      href={`https://www.youtube.com/watch?v=${selectedLevel.youtubeVideoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white hover:underline shrink-0 font-medium"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Key Principles & Architectural Takeaways */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Key Architectural Principles & Takeaways</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedLevel.keyTakeaways.map((takeaway, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-md bg-[#0e0e12] border border-zinc-850 flex items-start gap-2.5 text-zinc-300"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                          <p className="leading-relaxed text-xs">{takeaway}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Architecture Blueprint & Capacity Math */}
              {modalTab === "blueprint" && (
                <div className="space-y-4">
                  {/* Overview */}
                  <div className="p-3.5 rounded-md bg-[#0e0e12] border border-zinc-850 space-y-1.5">
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider block">
                      Architectural Summary
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {selectedLevel.architecturalBlueprint.overview}
                    </p>
                  </div>

                  {/* Capacity Math */}
                  {selectedLevel.architecturalBlueprint.capacityMath && (
                    <div className="p-3.5 rounded-md bg-[#0a0a0d] border border-zinc-800 space-y-2">
                      <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Back-of-the-Envelope Capacity Estimations</span>
                      </span>
                      <div className="p-2.5 rounded bg-zinc-950 font-mono text-xs text-zinc-200 border border-zinc-850 overflow-x-auto leading-relaxed">
                        {selectedLevel.architecturalBlueprint.capacityMath}
                      </div>
                    </div>
                  )}

                  {/* API Endpoints */}
                  {selectedLevel.architecturalBlueprint.apiEndpoints && (
                    <div className="p-3.5 rounded-md bg-[#0e0e12] border border-zinc-850 space-y-2">
                      <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Core API Interfaces</span>
                      </span>
                      <div className="space-y-1.5">
                        {selectedLevel.architecturalBlueprint.apiEndpoints.map((ep, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded bg-zinc-950 font-mono text-[11px] text-zinc-300 border border-zinc-850 overflow-x-auto"
                          >
                            {ep}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Core Components */}
                  <div className="p-3.5 rounded-md bg-[#0e0e12] border border-zinc-850 space-y-2">
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Core Architectural Components</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedLevel.architecturalBlueprint.coreComponents.map((comp, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                          <span className="truncate">{comp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Trade-Offs */}
                  <div className="p-3.5 rounded-md bg-zinc-950 border border-zinc-850 space-y-1.5">
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider block">
                      Critical System Trade-Offs
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {selectedLevel.architecturalBlueprint.tradeOffs}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: Engineering Papers & Resources */}
              {modalTab === "resources" && (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-400">
                    High-impact research papers, industry engineering blogs, and seminal architectural documentation:
                  </p>

                  <div className="space-y-2.5">
                    {selectedLevel.resources.map((resource, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-md bg-[#0e0e12] border border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                              {resource.type}
                            </span>
                            <h4 className="text-xs font-semibold text-white truncate">
                              {resource.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            {resource.description}
                          </p>
                        </div>

                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-medium shrink-0 transition-colors"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-md bg-zinc-950 border border-zinc-850 space-y-1.5 text-xs text-zinc-300">
                    <div className="flex items-center gap-1.5 font-medium text-white">
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Interview Recommendation</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                      Watch the complete architecture walkthrough video first to understand the end-to-end data flow. Next, review the back-of-the-envelope capacity math and component blueprints before marking this milestone as completed.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="p-4 border-t border-zinc-800 bg-[#0e0e12] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">
                  Topic Status:
                </span>
                {completedTopics[selectedLevel.id] ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500 font-medium">
                    <Circle className="w-3.5 h-3.5" />
                    Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleTopicCompletion(selectedLevel.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium border transition-colors ${
                    completedTopics[selectedLevel.id]
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60"
                      : "bg-white text-zinc-950 border-white hover:bg-zinc-200"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {completedTopics[selectedLevel.id] ? "Marked as Done ✓" : "Mark as Done"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLevel(null)}
                  className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
