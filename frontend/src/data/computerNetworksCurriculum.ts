export interface TopicItem {
  id: string;
  title: string;
  moduleName: string;
  readTime: string;
  summary: string;
  theThreeJobs?: {
    resourceManager: string;
    protectionLayer: string;
    hardwareHelper: string;
  };
  keyInvariants: string[];
  detailedContent: string;
  diagram?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  interviewWatchout?: string;
}

export interface ModuleGroup {
  id: string;
  name: string;
  topics: TopicItem[];
}

export interface RecallQuestion {
  id: string;
  question: string;
  difficulty: "Essential" | "Very High" | "High";
  topics: string[];
  modelAnswer: string;
  keyTakeaway: string;
}

export interface ReviseSection {
  title: string;
  summary: string;
  bullets: string[];
  formulaOrCode?: string;
}

// =========================================================================
// COMPUTER NETWORKS: EXACT PREPLOOM CURRICULUM (7 MODULES, 35 TOPICS)
// =========================================================================

export const NETWORKS_MODULES: ModuleGroup[] = [
  // ----------------------------------------------------
  // Module 1: Networking Foundations (5 Topics)
  // ----------------------------------------------------
  {
    id: "cn-mod-1",
    name: "1. Networking Foundations",
    topics: [
      {
        id: "cn-1-1",
        title: "Introduction to Computer Networks",
        moduleName: "1. Networking Foundations",
        readTime: "5 min read",
        summary:
          "A computer network is an interconnected collection of autonomous computing devices exchanging data over communication links through standardized protocols.",
        theThreeJobs: {
          resourceManager:
            "Packet Encapsulation & Transport: Breaks continuous application byte-streams into discrete packets stamped with protocol headers.",
          protectionLayer:
            "Routing & Global Interconnection: Evaluates distributed routing tables and forwarding paths across autonomous systems.",
          hardwareHelper:
            "Reliability & Flow Management: Compensates for physical line errors, lossy media, and receiver buffer overruns.",
        },
        keyInvariants: [
          "Networks trade off Bandwidth (capacity), Latency (propagation delay), and Jitter (delay variance).",
          "Packet Switching multiplexes shared links dynamically, outperforming dedicated Circuit Switching for bursty data.",
          "Network performance is bounded by the speed of light in optical fiber (~200,000 km/s) and queuing delays at intermediate routers.",
        ],
        detailedContent:
          "Computer networks connect distributed endpoints to share computational resources, storage, and software services.\n\nKey Performance Metrics:\n1. Throughput: The rate at which bits are successfully transferred from source to destination (bits per second).\n2. Propagation Delay: Time for a signal bit to physically travel across the transmission medium: `d_prop = Distance / Propagation_Speed`.\n3. Transmission Delay: Time required to push all packet bits onto the wire: `d_trans = Packet_Size (L) / Link_Bandwidth (R)`.\n4. Queuing Delay: Time a packet spends waiting in router buffer queues before transmission, fluctuating with network congestion.\n5. Processing Delay: Time consumed by a router examining packet headers, checking bit errors (checksums), and selecting outbound interfaces.",
        diagram: `+-------------------------------------------------------------+
|              Four Components of Total Packet Delay          |
+-------------------------------------------------------------+
|                                                             |
|   [ Source Node ]                                           |
|          |                                                  |
|          v  Transmission Delay: d_trans = L / R             |
|   +--------------+                                          |
|   | Router Input |                                          |
|   +--------------+                                          |
|          |                                                  |
|          v  Processing Delay: d_proc (Checksum / Lookup)   |
|   +--------------+                                          |
|   | Queue Buffer |                                          |
|   +--------------+                                          |
|          |                                                  |
|          v  Queuing Delay: d_queue (Congestion dependent)   |
|   +--------------+                                          |
|   | Line Output  |                                          |
|   +--------------+                                          |
|          |                                                  |
|          v  Propagation Delay: d_prop = d / s               |
|   [ Next Hop Router / Destination ]                         |
|                                                             |
|   Total Delay: d_nodal = d_proc + d_queue + d_trans + d_prop|
+-------------------------------------------------------------+`,
        comparisonTable: {
          headers: ["Criterion", "Circuit Switching (PSTN)", "Packet Switching (Internet)"],
          rows: [
            ["Resource Reservation", "Dedicated end-to-end channel", "Statistical multiplexing (on-demand)"],
            ["Congestion Behavior", "Blocked calls if capacity reached", "Queuing delays and packet drops"],
            ["Resource Utilization", "Wasteful during silent periods", "Highly efficient for bursty traffic"],
            ["State in Intermediate Nodes", "Stateful call connection maintained", "Stateless per-packet forwarding"],
          ],
        },
        interviewWatchout:
          "Distinguish sharply between Transmission Delay (how fast the network interface card can push bits onto the link: L/R) and Propagation Delay (how fast electromagnetic waves travel through physical glass or copper: d/s).",
      },
      {
        id: "cn-1-2",
        title: "Network Communication Models",
        moduleName: "1. Networking Foundations",
        readTime: "5 min read",
        summary:
          "Distributed network architectures divide system roles between centralized Client-Server models and decentralized Peer-to-Peer (P2P) systems.",
        keyInvariants: [
          "Client-Server: Centralized server maintains authoritative state; clients initiate contact with passive, always-on servers.",
          "Peer-to-Peer (P2P): Arbitrary pairs of connected hosts (peers) communicate directly and share uploading/downloading burdens.",
          "P2P systems exhibit self-scalability: new peers bring service capacity (upload bandwidth) alongside service demand.",
        ],
        detailedContent:
          "Network architecture models govern service topology:\n\n1. Client-Server Architecture:\n- Dedicated server with a fixed, well-known IP address listens for incoming client requests.\n- Scalability limits: Server bandwidth and CPU become bottlenecks as concurrent clients scale into millions. Requires horizontal scaling via Load Balancers, Reverse Proxies, and database replication.\n- Examples: Web browsing (HTTP), Email retrieval (IMAP), Database connections.\n\n2. Peer-to-Peer (P2P) Architecture:\n- Hosts communicate directly without relying on a dedicated centralized server.\n- Distributed Hash Tables (DHTs) route lookup queries across decentralized peer nodes.\n- Self-Scalability: In BitTorrent, as 10,000 new users join a swarm to download a file, they simultaneously contribute 10,000 upload streams, multiplying system bandwidth.\n- Challenges: Node churn (peers disconnect abruptly), NAT traversal, security and leeching prevention.",
        interviewWatchout:
          "Explain why hybrid architectures dominate modern computing: BitTorrent uses centralized trackers with P2P file transfers; Skype used supernodes before migrating to cloud infrastructure.",
      },
      {
        id: "cn-1-3",
        title: "OSI and TCP/IP Models",
        moduleName: "1. Networking Foundations",
        readTime: "6 min read",
        summary:
          "The theoretical 7-Layer OSI model standardizes conceptual network boundaries, while the pragmatic 4-Layer TCP/IP suite forms the actual engineering architecture of the global Internet.",
        keyInvariants: [
          "OSI 7 Layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
          "TCP/IP 4 Layers: Network Access (Link), Internet (IP), Transport (TCP/UDP), Application.",
          "Layer modularity: Each layer relies strictly on the services of the layer below and serves the layer above through well-defined APIs.",
        ],
        detailedContent:
          "Layered architecture divides complex networking into modular, interchangeable protocols.\n\nOSI Model Layers (Bottom to Top):\n1. Physical: Transmission of raw unstructured bitstreams over physical media (voltages, optical pulses, RF frequencies).\n2. Data Link: Node-to-node framing, physical MAC addressing, error detection (CRC), flow control across a single local link.\n3. Network: Host-to-host packet routing across heterogeneous networks using logical IP addresses.\n4. Transport: End-to-end process-to-process communication, port multiplexing, segmentation, reliability (TCP), flow/congestion control.\n5. Session: Managing dialogs, session checkpoints, and connection synchronization.\n6. Presentation: Data format translation, character encoding, compression, and encryption/decryption (TLS).\n7. Application: High-level protocols exposed to user software (HTTP, DNS, SSH, SMTP).\n\nWhy TCP/IP Won the Implementation War:\nThe TCP/IP suite collapsed OSI layers 5, 6, and 7 into a single pragmatic Application layer, allowing applications to manage their own encryption and presentation formats directly.",
        comparisonTable: {
          headers: ["OSI Layer (7 Layers)", "TCP/IP Suite (4 Layers)", "Protocol Data Unit (PDU)", "Example Protocols"],
          rows: [
            ["7. Application", "Application Layer", "Data / Message", "HTTP, DNS, SSH, SMTP"],
            ["6. Presentation", "Application Layer", "Data", "TLS, JSON, ASN.1"],
            ["5. Session", "Application Layer", "Data", "RPC, Sockets, NetBIOS"],
            ["4. Transport", "Transport Layer", "Segment (TCP) / Datagram (UDP)", "TCP, UDP, QUIC"],
            ["3. Network", "Internet Layer", "Packet / Datagram", "IPv4, IPv6, ICMP, OSPF, BGP"],
            ["2. Data Link", "Network Access Layer", "Frame", "Ethernet (802.3), Wi-Fi (802.11), ARP"],
            ["1. Physical", "Network Access Layer", "Bits", "Copper Cat6, Fiber Optic, 5G RF"],
          ],
        },
        interviewWatchout:
          "Remember the exact PDU names per layer: Application = Message; Transport = Segment; Network = Packet; Data Link = Frame; Physical = Bits. Calling an IP packet a 'frame' or a TCP segment a 'packet' is an immediate red flag in staff interviews.",
      },
      {
        id: "cn-1-4",
        title: "Encapsulation and the Packet Journey",
        moduleName: "1. Networking Foundations",
        readTime: "6 min read",
        summary:
          "As data descends the protocol stack, each layer prepends a specialized header (encapsulation). At the destination, layers inspect and strip their respective headers (decapsulation).",
        keyInvariants: [
          "Encapsulation wraps user payload in headers containing layer-specific addressing and control metadata.",
          "Routers inspect and modify up to Layer 3 (IP header TTL decrement, checksum update, next-hop routing).",
          "Switches inspect and forward at Layer 2 (MAC address lookup); they do not alter IP headers.",
        ],
        detailedContent:
          "The Encapsulation Pipeline:\n1. Application: An HTTP client constructs a GET request string (Payload: `GET / HTTP/1.1`).\n2. Transport: Prepend TCP header (Source Port 54321, Dest Port 443, Sequence Number, Window Size). Creates a TCP Segment.\n3. Network: Prepend IP header (Source IP 192.168.1.5, Dest IP 142.250.190.46, TTL 64, Protocol 6). Creates an IP Packet.\n4. Data Link: Prepend Ethernet header (Source MAC `AA:BB:...`, Dest MAC of Default Gateway `CC:DD:...`, EtherType `0x0800`), and append Frame Check Sequence (CRC-32 trailer). Creates an Ethernet Frame.\n5. Physical: The network card converts frame bytes into modulated electrical/optical signals.",
        diagram: `+-------------------------------------------------------------+
|                 Packet Encapsulation Pipeline               |
+-------------------------------------------------------------+
|  Application:       [ HTTP Message Payload ]                |
|                              |                              |
|  Transport (L4):    [ TCP Hdr | HTTP Payload ]              |
|                              | (TCP Segment)                |
|  Network (L3):      [ IP Hdr  | TCP Hdr | Payload ]         |
|                              | (IP Packet)                  |
|  Data Link (L2):    [ Eth Hdr | IP Hdr | TCP | Payload | CRC]|
|                              | (Ethernet Frame)             |
|  Physical (L1):     010110010101110010101010010101100101010 |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "In a multi-hop router path, the IP packet's Source and Destination IP addresses remain constant end-to-end (barring NAT), but the Ethernet Frame's Source and Destination MAC addresses change at EVERY SINGLE HOP as the packet traverses different links.",
      },
      {
        id: "cn-1-5",
        title: "Network Topologies and Devices",
        moduleName: "1. Networking Foundations",
        readTime: "6 min read",
        summary:
          "Network devices operate at specific protocol layers: Hubs (L1), Switches (L2), Routers (L3), and Gateways (L4-L7). Topologies organize geometric device interconnections.",
        keyInvariants: [
          "Hub (L1): Physical repeater; single collision domain and single broadcast domain across all ports.",
          "Switch (L2): Learns MAC addresses; micro-segments collision domains (1 per port); maintains 1 broadcast domain.",
          "Router (L3): Forwards by IP address; breaks both collision domains AND broadcast domains.",
        ],
        detailedContent:
          "Device Hierarchy by Layer:\n\n1. Hub (Layer 1):\n- Dumb electrical signal repeater. Any electrical signal arriving on port 1 is blindly rebroadcast to all other ports.\n- Entire hub constitutes a single Collision Domain. Heavy collisions occur if two nodes transmit simultaneously.\n\n2. Switch (Layer 2):\n- Inspects incoming Ethernet frame headers, reads Source MAC to populate its internal CAM Table (MAC address table), and forwards frames exclusively to the specific port linked to the Destination MAC.\n- Eliminates collisions: every port is its own isolated collision domain.\n- Broadcast frames (Destination MAC `FF:FF:FF:FF:FF:FF`) are flooded to all ports (Single Broadcast Domain).\n\n3. Router (Layer 3):\n- Connects distinct IP subnets. Maintains routing tables (FIB). Inspects destination IP addresses and chooses optimal outbound paths.\n- Routers do NOT forward L2 broadcast frames, effectively breaking broadcast domains.",
        comparisonTable: {
          headers: ["Device", "OSI Layer", "Collision Domains", "Broadcast Domains", "Forwarding Table"],
          rows: [
            ["Hub", "Layer 1 (Physical)", "1 shared domain", "1 shared domain", "None (blind electrical flood)"],
            ["Switch", "Layer 2 (Data Link)", "1 per port (Isolated)", "1 shared domain (unless VLANs)", "CAM Table (MAC -> Port)"],
            ["Router", "Layer 3 (Network)", "1 per port (Isolated)", "1 per port (Isolated)", "Routing Table (FIB: IP -> Interface)"],
            ["Gateway", "Layer 4-7 (Application)", "Isolated", "Isolated", "Stateful proxy / translation table"],
          ],
        },
        interviewWatchout:
          "When asked: 'How many collision domains and broadcast domains does a 24-port switch have?' Answer: 24 collision domains (one per port) and 1 broadcast domain (unless partitioned by VLANs).",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 2: Application Layer and Web Services (5 Topics)
  // ----------------------------------------------------
  {
    id: "cn-mod-2",
    name: "2. Application Layer and Web Services",
    topics: [
      {
        id: "cn-2-1",
        title: "Application Protocols and Services",
        moduleName: "2. Application Layer and Web Services",
        readTime: "5 min read",
        summary:
          "The Application Layer provides services directly to user applications. Core application protocols include HTTP (web), SMTP (mail delivery), IMAP/POP3 (mail retrieval), FTP, and SSH.",
        keyInvariants: [
          "Application protocols define message syntax, field semantics, request-response timing rules, and error handling.",
          "Standard well-known ports: HTTP (80), HTTPS (443), DNS (53), SSH (22), SMTP (25), NTP (123).",
          "Application protocols run in user space and communicate over operating system network sockets.",
        ],
        detailedContent:
          "Core Application Protocols:\n- HTTP/HTTPS: Hypertext Transfer Protocol. Stateless request-response protocol powering the World Wide Web.\n- SMTP (Simple Mail Transfer Protocol): Push protocol used by email clients to send mail to servers, and between mail transfer agents (MTAs).\n- IMAP / POP3: Pull protocols used by email clients to fetch messages from mail servers. IMAP synchronizes state across multiple devices; POP3 downloads and deletes locally.\n- SSH (Secure Shell): Encrypted terminal remote administration running over TCP port 22, utilizing public-key cryptography.\n- NTP (Network Time Protocol): Synchronizes distributed computer clocks to within milliseconds of UTC over UDP port 123.",
        interviewWatchout:
          "Distinguish clearly between SMTP (a push protocol for sending email) and IMAP/POP3 (pull protocols for retrieving email).",
      },
      {
        id: "cn-2-2",
        title: "Domain Name System (DNS)",
        moduleName: "2. Application Layer and Web Services",
        readTime: "6 min read",
        summary:
          "DNS is the global distributed hierarchical database that translates human-readable domain names into machine-routable IP addresses, running primarily over UDP port 53.",
        keyInvariants: [
          "DNS Hierarchy: Root DNS Servers (.) -> Top-Level Domain (TLD) Servers (.com) -> Authoritative Nameservers (example.com).",
          "Recursive Query: Client requests recursive resolver to do all lookup work; resolver returns final answer.",
          "Iterative Query: Resolver queries nameservers directly; nameserver replies with referral to the next nameserver down the tree.",
        ],
        detailedContent:
          "DNS Resolution Step-by-Step (`www.example.com`):\n1. Local Cache: OS checks browser cache, OS resolver cache, and `/etc/hosts`.\n2. Recursive Resolver: Query sent to ISP resolver or public DNS (8.8.8.8, 1.1.1.1).\n3. Root Nameserver (.): Returns IP of `.com` TLD nameservers.\n4. TLD Nameserver (.com): Returns IP of `example.com` authoritative nameserver.\n5. Authoritative Nameserver: Returns the final resource record (A or AAAA record).\n\nKey DNS Record Types:\n- A Record: Maps hostname to 32-bit IPv4 address.\n- AAAA Record: Maps hostname to 128-bit IPv6 address.\n- CNAME (Canonical Name): Maps alias to true canonical domain name.\n- MX (Mail Exchange): Points to email server hostnames for the domain.\n- TXT: Holds text metadata (SPF, DKIM, domain verification tokens).\n- NS: Authoritative nameserver for the zone.",
        diagram: `+-------------------------------------------------------------+
|                  Hierarchical DNS Resolution Flow           |
+-------------------------------------------------------------+
|  [ Browser ]                                                |
|      | 1. Query: www.example.com?                           |
|      v                                                      |
|  [ Recursive Resolver (e.g. 1.1.1.1) ]                      |
|      | 2. Who has .com?       | 4. Who has example.com?     |
|      v                        v                             |
|  [ Root Server (.) ]     [ .com TLD Server ]                |
|      | 3. Referral to TLD     | 5. Referral to Auth         |
|      +------------------------+                             |
|      | 6. What is A record for www.example.com?             |
|      v                                                      |
|  [ Authoritative DNS Server (ns1.example.com) ]             |
|      | 7. Return A: 93.184.216.34 (TTL = 3600)              |
|      v                                                      |
|  [ Client caches record and initiates TCP handshake ]       |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "Why does DNS run over UDP 53 instead of TCP? UDP avoids the latency and overhead of 3-way handshakes for short request-response packets. However, DNS falls back to TCP 53 when responses exceed 512 bytes (EDNS0) or during Zone Transfers (AXFR).",
      },
      {
        id: "cn-2-3",
        title: "HTTP Messages and Semantics",
        moduleName: "2. Application Layer and Web Services",
        readTime: "6 min read",
        summary:
          "HTTP is a stateless request-response protocol. Requests consist of Method, URI, Headers, and Body; Responses return Status Code, Headers, and Body.",
        keyInvariants: [
          "Idempotent Methods: Multiple identical requests produce the same server resource state (GET, PUT, DELETE, HEAD, OPTIONS).",
          "Non-Idempotent Methods: Multiple requests create multiple side effects (POST).",
          "Safe Methods: Do not mutate server state at all (GET, HEAD, OPTIONS).",
        ],
        detailedContent:
          "HTTP Protocol Mechanics:\n\nKey HTTP Methods:\n- GET: Retrieve resource representation. Must be safe and idempotent.\n- POST: Submits entity to target resource, creating new child state (non-idempotent).\n- PUT: Replace entire target resource with payload (idempotent).\n- PATCH: Partial modification of a resource.\n- DELETE: Remove resource (idempotent).\n\nStatus Code Taxonomy:\n- 1xx Informational: Request received, continuing (101 Switching Protocols).\n- 2xx Success: Action understood and accepted (200 OK, 201 Created, 204 No Content).\n- 3xx Redirection: Further action needed (301 Moved Permanently, 302 Found, 304 Not Modified).\n- 4xx Client Error: Syntax error or unauthorized (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests).\n- 5xx Server Error: Server failed to fulfill valid request (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout).",
        interviewWatchout:
          "Difference between 401 Unauthorized and 403 Forbidden: 401 means Unauthenticated (identity unknown; credentials missing or invalid). 403 means Authenticated, but Unauthorized (identity confirmed, but lacks required permissions).",
      },
      {
        id: "cn-2-4",
        title: "HTTPS and HTTP Evolution",
        moduleName: "2. Application Layer and Web Services",
        readTime: "7 min read",
        summary:
          "HTTP/1.1 added persistent connections; HTTP/2 introduced binary multiplexed framing over a single TCP stream; HTTP/3 migrated to QUIC over UDP to eliminate TCP head-of-line blocking.",
        keyInvariants: [
          "HTTPS = HTTP over TLS (Transport Layer Security); default port 443.",
          "HTTP/1.1 suffers from Application-Level Head-of-Line Blocking: responses must return in strict request order.",
          "HTTP/2 multiplexes streams on a single TCP connection, but suffers from Transport-Level Head-of-Line Blocking when TCP packets drop.",
          "HTTP/3 replaces TCP with QUIC (built on UDP), achieving true independent stream delivery and 0-RTT handshakes.",
        ],
        detailedContent:
          "Evolution of Web Transport:\n\n1. HTTP/1.1:\n- Introduced persistent connections (`Connection: keep-alive`) to reuse TCP connections across multiple requests.\n- Pipelining was flawed: if request 1 takes 5 seconds, responses 2 and 3 cannot be transmitted (Application Head-of-Line Blocking). Browsers worked around this by opening 6 parallel TCP connections per origin.\n\n2. HTTP/2 (2015):\n- Switched from ASCII text to binary framing.\n- Single TCP connection per domain with bi-directional Multiplexing: multiple logical streams interleave frames simultaneously.\n- HPACK header compression and Server Push.\n- Flaw: All streams share one TCP connection. If a single packet drops on the wire, TCP stalls all streams until the missing segment is retransmitted (Transport-Level Head-of-Line Blocking).\n\n3. HTTP/3 & QUIC (2022):\n- Runs over UDP. Re-implements reliable transport, encryption, and congestion control in user space.\n- Streams are fully decoupled: packet loss on stream 1 does NOT stall stream 2!\n- Combines transport and TLS 1.3 handshakes into a single round trip (1-RTT or 0-RTT connection resumption).",
        comparisonTable: {
          headers: ["Feature", "HTTP/1.1", "HTTP/2", "HTTP/3"],
          rows: [
            ["Transport Protocol", "TCP", "TCP", "QUIC (over UDP)"],
            ["Connection Model", "Multiple connections (up to 6)", "Single multiplexed connection", "Single multiplexed connection"],
            ["Framing", "Plain ASCII text", "Binary frames", "Binary frames"],
            ["Head-of-Line Blocking", "Severe (Application Level)", "Present (TCP Packet Drop Level)", "Completely Eliminated"],
            ["TLS Integration", "Layered on top of TCP", "Layered on top of TCP", "Built directly into QUIC"],
          ],
        },
        interviewWatchout:
          "Be ready to explain how HTTP/3 solves TCP Head-of-Line blocking: because QUIC streams are independent at the transport layer, loss of a packet on stream A only stalls stream A; stream B and C continue processing without interruption.",
      },
      {
        id: "cn-2-5",
        title: "CDN and Web Caching",
        moduleName: "2. Application Layer and Web Services",
        readTime: "5 min read",
        summary:
          "Content Delivery Networks (CDNs) cache static and dynamic assets at edge Point of Presence (PoP) locations close to users, reducing latency, origin server load, and bandwidth costs.",
        keyInvariants: [
          "Edge Caching reduces RTT from hundreds of milliseconds to under 10ms by serving assets locally.",
          "Cache-Control headers (max-age, no-cache, no-store, immutable) dictate caching lifetime and validation rules.",
          "Conditional Requests (If-Modified-Since, If-None-Match) validate stale assets via 304 Not Modified responses.",
        ],
        detailedContent:
          "CDN Operation & Edge Routing:\n1. Anycast DNS: When a user queries a CDN domain, Anycast BGP routes the request to the geographically nearest Point of Presence (PoP).\n2. Cache Hit: The edge server returns the cached response immediately, bypassing origin servers completely.\n3. Cache Miss: The edge server fetches the asset from the origin server, stores a copy in local SSD caches, and returns it to the client.\n\nHTTP Caching Directives:\n- `Cache-Control: public, max-age=31536000, immutable`: Caches for 1 year in browsers and CDNs without revalidation (ideal for fingerprinted assets like `app.8f3a1.js`).\n- `Cache-Control: no-cache`: Must validate freshness with origin server before serving cached copy.\n- `Cache-Control: no-store`: Never store any part of the request or response in any cache (confidential banking data).\n- `ETag` (Entity Tag): Content hash fingerprint sent in `If-None-Match` headers for validation.",
        interviewWatchout:
          "Explain the difference between `no-cache` and `no-store`: `no-cache` allows storing the asset locally, but forces a validation check (`304 Not Modified`) with origin before using it; `no-store` forbids the browser and CDNs from writing the asset to disk or memory at all.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 3: Transport Layer and Reliable Delivery (5 Topics)
  // ----------------------------------------------------
  {
    id: "cn-mod-3",
    name: "3. Transport Layer and Reliable Delivery",
    topics: [
      {
        id: "cn-3-1",
        title: "Transport Services, Ports, and Sockets",
        moduleName: "3. Transport Layer and Reliable Delivery",
        readTime: "5 min read",
        summary:
          "The Transport Layer bridges network host-to-host delivery with application process-to-process communication using 16-bit Port numbers and Socket abstractions.",
        keyInvariants: [
          "A Socket is defined by a 5-tuple: {Source IP, Source Port, Dest IP, Dest Port, Protocol}.",
          "Ports range from 0 to 65535: Well-known (0-1023), Registered (1024-49151), Ephemeral/Dynamic (49152-65535).",
          "Multiplexing gathers data from multiple sockets and adds transport headers; Demultiplexing directs incoming segments to the matching socket.",
        ],
        detailedContent:
          "Multiplexing and Demultiplexing Mechanics:\n- Transport Layer Multiplexing: The OS reads data chunks from application sockets, attaches Source and Destination port headers, and passes segments down to the Network layer.\n- Transport Layer Demultiplexing:\n  - Connectionless (UDP): Demultiplexing is based strictly on `{Destination IP, Destination Port}`. Two packets from different source IPs with the same destination port land in the exact same UDP socket!\n  - Connection-Oriented (TCP): Demultiplexing is based on the full 4-tuple `{Source IP, Source Port, Destination IP, Destination Port}`. Each concurrent client connection has its own dedicated socket handle.",
        interviewWatchout:
          "Why can a web server accept 50,000 concurrent client connections on port 443 without conflict? Because each TCP connection is identified by the unique 4-tuple `{Client IP, Client Ephemeral Port, Server IP, 443}`.",
      },
      {
        id: "cn-3-2",
        title: "TCP and UDP Fundamentals",
        moduleName: "3. Transport Layer and Reliable Delivery",
        readTime: "6 min read",
        summary:
          "TCP provides reliable, ordered, connection-oriented byte-stream delivery with congestion control. UDP provides lightweight, connectionless, unreliable datagram delivery with minimal latency.",
        keyInvariants: [
          "TCP guarantees reliability via ACKs, sequence numbers, checksums, and retransmissions.",
          "UDP is a thin wrapper over IP: 8-byte header, no connection setup, no retransmissions, no flow/congestion control.",
          "TCP is byte-stream oriented (no message boundaries); UDP is datagram oriented (preserves message boundaries).",
        ],
        detailedContent:
          "Header Comparison:\n- UDP Header: Minimal 8 bytes containing only Source Port (16b), Destination Port (16b), Length (16b), and Checksum (16b).\n- TCP Header: 20 bytes (minimum) containing Source Port, Dest Port, Sequence Number (32b), Acknowledgment Number (32b), Data Offset (4b), Control Flags (SYN, ACK, FIN, RST, PSH, URG), Window Size (16b), Checksum, Urgent Pointer, and Options (MSS, Window Scale, SACK).\n\nWhen to Choose UDP:\n1. Real-time media streaming (VoIP, video calls) where timely delivery matters more than occasional lost frames.\n2. Online multiplayer gaming where outdated player coordinates are useless.\n3. Lightweight request-response protocols (DNS, NTP, SNMP).\n4. When implementing modern custom transport engines (QUIC / HTTP/3).",
        comparisonTable: {
          headers: ["Attribute", "TCP", "UDP"],
          rows: [
            ["Connection Model", "Connection-oriented (3-way handshake)", "Connectionless"],
            ["Reliability", "Guaranteed (in-order, no loss/duplicates)", "Best-effort (loss/reordering possible)"],
            ["Header Size", "20 to 60 bytes", "8 bytes fixed"],
            ["Data Stream", "Continuous byte stream (no boundaries)", "Discrete datagrams (message boundaries preserved)"],
            ["Flow & Congestion Control", "Yes (Sliding window & AIMD)", "None (application transmits at will)"],
            ["Transmission Speed", "Slower (handshake & ACK overhead)", "Fastest (zero connection state)"],
          ],
        },
        interviewWatchout:
          "TCP is a byte-stream protocol: if an application writes 100 bytes twice, the receiver might read it as one 200-byte chunk, or four 50-byte chunks. The application layer must define its own message delimiters.",
      },
      {
        id: "cn-3-3",
        title: "TCP Connection Management and Three-Way Handshake",
        moduleName: "3. Transport Layer and Reliable Delivery",
        readTime: "7 min read",
        summary:
          "TCP establishes connections using a Three-Way Handshake (SYN -> SYN-ACK -> ACK) to synchronize Initial Sequence Numbers (ISNs) and terminates connections using a Four-Way Handshake (FIN/ACK).",
        keyInvariants: [
          "Three-Way Handshake synchronizes ISN (Initial Sequence Number) in both directions.",
          "ISN is randomized to prevent sequence prediction attacks and avoid crosstalk from old lingering connections.",
          "TIME_WAIT state lasts for 2 * MSL (Maximum Segment Lifetime, typically 60-120s) to guarantee last ACK arrived and drain duplicate packets.",
        ],
        detailedContent:
          "Three-Way Handshake Sequence:\n1. Step 1 (SYN): Client picks random ISN `x`, sends `[SYN, seq=x]` to server. Client enters `SYN_SENT` state.\n2. Step 2 (SYN-ACK): Server receives SYN, allocates transmission buffers, picks random ISN `y`, and replies with `[SYN, ACK, seq=y, ack=x+1]`. Server enters `SYN_RCVD` state.\n3. Step 3 (ACK): Client receives SYN-ACK, replies with `[ACK, seq=x+1, ack=y+1]`. Both enter `ESTABLISHED` state. Data payload can be piggybacked on this ACK.\n\nConnection Teardown (Four-Way Wave):\n1. Active closer sends `[FIN, seq=u]`, enters `FIN_WAIT_1`.\n2. Passive closer replies with `[ACK, ack=u+1]`, enters `CLOSE_WAIT`. Active closer enters `FIN_WAIT_2`.\n3. Passive closer finishes flushing data, sends its own `[FIN, seq=v]`, enters `LAST_ACK`.\n4. Active closer replies with `[ACK, ack=v+1]`, enters `TIME_WAIT`.\n\nSYN Flood Denial of Service Attack:\nAttackers send millions of spoofed SYN packets without sending the final ACK. The server's SYN queue fills with half-open connections, exhausting memory. Mitigation: SYN Cookies (encoding connection state cryptographically into the server ISN without allocating memory until the valid third ACK arrives).",
        diagram: `+-------------------------------------------------------------+
|               TCP Three-Way Handshake & Teardown            |
+-------------------------------------------------------------+
| CLIENT                                              SERVER  |
|   |                  1. SYN (seq=x)                   |     |
|   |-------------------------------------------------->|     |
|   |             2. SYN-ACK (seq=y, ack=x+1)           |     |
|   |<--------------------------------------------------|     |
|   |                  3. ACK (ack=y+1)                 |     |
|   |-------------------------------------------------->|     |
|   |               [ ESTABLISHED STATE ]               |     |
|   |                                                   |     |
|   |                  4. FIN (seq=u)                   |     |
|   |-------------------------------------------------->|     |
|   |                  5. ACK (ack=u+1)                 |     |
|   |<--------------------------------------------------|     |
|   |                  6. FIN (seq=v)                   |     |
|   |<--------------------------------------------------|     |
|   |                  7. ACK (ack=v+1)                 |     |
|   |-------------------------------------------------->|     |
|   | [ TIME_WAIT: 2*MSL ]                    [ CLOSED ]|     |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "Why is a 2-way handshake insufficient? Because in an unreliable network, delayed duplicate SYN packets could arrive at the server long after an old connection closed, causing the server to incorrectly open a new connection and wait for data that will never arrive.",
      },
      {
        id: "cn-3-4",
        title: "Flow Control and Sliding Window",
        moduleName: "3. Transport Layer and Reliable Delivery",
        readTime: "6 min read",
        summary:
          "Flow control prevents a fast sender from overwhelming a slow receiver's buffer. The receiver advertises its available buffer space via the Receive Window (rwnd) in every ACK.",
        keyInvariants: [
          "Flow Control is end-to-end between sender and receiver; Congestion Control is sender vs the entire network.",
          "Receive Window (rwnd): In bytes, advertised by receiver indicating currently available buffer space.",
          "Sliding Window formula: Allowed inflight data = min(rwnd, cwnd).",
          "Zero Window Probe: Sent periodically by sender when rwnd = 0 to detect when receiver buffer frees up.",
        ],
        detailedContent:
          "Sliding Window Protocols Evolution:\n1. Stop-and-Wait: Sender transmits 1 packet and waits for ACK before sending the next. Terrible link utilization: Efficiency = `t_trans / (t_trans + 2 * t_prop)`.\n2. Go-Back-N (GBN): Pipelined protocol. Sender can transmit up to N unacknowledged packets. Receiver uses cumulative ACKs and discards out-of-order packets. If a packet drops, sender retransmits ALL N packets starting from the lost one.\n3. Selective Repeat (SR): Receiver buffers out-of-order packets individually. Sender retransmits ONLY the specific dropped packet based on Selective ACKs (SACK).\n\nSilly Window Syndrome:\nOccurs when the receiver advertises a small window (e.g. 2 bytes) and the sender immediately transmits a 2-byte payload inside a 40-byte TCP/IP header (95% overhead!). Solved by Clark's Algorithm at the receiver (delay advertising window until 50% buffer or 1 MSS is free) and Nagle's Algorithm at the sender (accumulate small writes into full MSS segments).",
        interviewWatchout:
          "Know Nagle's Algorithm: It buffers small outbound application writes until a full MSS segment can be transmitted or until an ACK arrives for previously transmitted data. In low-latency games or UI terminals, Nagle's algorithm is disabled via `TCP_NODELAY`.",
      },
      {
        id: "cn-3-5",
        title: "TCP Congestion Control",
        moduleName: "3. Transport Layer and Reliable Delivery",
        readTime: "7 min read",
        summary:
          "Congestion control prevents sender traffic from overloading intermediate router buffers. Classic TCP uses AIMD (Additive Increase Multiplicative Decrease) across Slow Start, Congestion Avoidance, and Fast Recovery.",
        keyInvariants: [
          "Congestion Window (cwnd): State variable dynamically adjusted by sender based on perceived network capacity.",
          "Slow Start: cwnd starts at initial value (e.g. 10 MSS) and doubles every RTT (exponential growth) until ssthresh.",
          "Congestion Avoidance: cwnd increases linearly by 1 MSS per RTT (Additive Increase) once cwnd >= ssthresh.",
          "Loss Detection: 3 Duplicate ACKs triggers Fast Retransmit (cwnd halved - Multiplicative Decrease); RTO Timeout drops cwnd to 1 MSS.",
        ],
        detailedContent:
          "The Four Phases of Classic TCP (Tahoe / Reno):\n\n1. Slow Start:\n- `cwnd` begins at 10 MSS.\n- For each ACK received, `cwnd` increases by 1 MSS. Effect: `cwnd` doubles every round-trip time (RTT).\n- Continues until `cwnd` hits the Slow Start Threshold (`ssthresh`).\n\n2. Congestion Avoidance (Linear Phase):\n- When `cwnd >= ssthresh`, exponential growth stops.\n- `cwnd` increases by `1 / cwnd` per ACK (increases by 1 MSS per full RTT).\n\n3. Fast Retransmit & Fast Recovery:\n- If 1 packet is lost but subsequent packets arrive, the receiver emits Duplicate ACKs.\n- Upon receiving 3 Duplicate ACKs, TCP does not wait for the Retransmission Timeout (RTO) timer to expire; it retransmits the missing segment immediately (Fast Retransmit).\n- Fast Recovery (TCP Reno): Sets `ssthresh = cwnd / 2`, sets `cwnd = ssthresh + 3 MSS`, and remains in congestion avoidance without dropping back to 1 MSS.\n\n4. Modern Congestion Control: BBR (Bottleneck Bandwidth and RTT):\nDeveloped by Google, BBR moves away from loss-based AIMD. It actively measures maximum bottleneck delivery rate and minimum round-trip time, pumping data at the exact physical line rate to avoid filling router queues (eliminating 'Bufferbloat').",
        diagram: `+-------------------------------------------------------------+
|              TCP Congestion Window Lifecycle (AIMD)         |
+-------------------------------------------------------------+
| cwnd (MSS)                                                  |
|    |                                                        |
| 32 |                       /\\ (3 Dup ACKs: Reno Halves)     |
|    |                      /  \\     /\\                       |
| 16 |     /\\  ssthresh -> /----\\---/--\\------------------    |
|    |    /  \\            /      \\ /    \\                     |
|  8 |   /    \\          / (Linear AIMD)                      |
|    |  /      \\        /                                     |
|  4 | / (Exp)  \\      /                                      |
|  2 |/          \\    /                                       |
|  1 |            \\  / (Timeout: Drops to 1 MSS in Tahoe)     |
|    +---------------------------------------------------->   |
|      Slow Start  Loss    Slow Start  Congestion Avoidance   |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "Explain why loss-based congestion control performs poorly on modern fiber and 5G networks: packet loss is not always caused by congestion (it can be caused by wireless fading), causing standard TCP to unnecessarily throttle its transmission rate by 50%. This is why modern CDNs adopt BBR.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 4: Network Layer, Addressing, and Routing (5 Topics)
  // ----------------------------------------------------
  {
    id: "cn-mod-4",
    name: "4. Network Layer, Addressing, and Routing",
    topics: [
      {
        id: "cn-4-1",
        title: "IPv4 Addressing, Subnetting, and CIDR",
        moduleName: "4. Network Layer, Addressing, and Routing",
        readTime: "7 min read",
        summary:
          "IPv4 uses 32-bit addresses divided into Network and Host portions. Classless Inter-Domain Routing (CIDR) uses variable-length subnet masks to prevent address space exhaustion.",
        keyInvariants: [
          "IPv4 Address is 32 bits (4 octets written in dotted-decimal format, e.g. 192.168.1.1).",
          "Subnet Mask defines boundary: binary 1s indicate Network ID; binary 0s indicate Host ID.",
          "Total usable hosts in a /N subnet = 2^(32 - N) - 2 (subtracting Network Address and Broadcast Address).",
        ],
        detailedContent:
          "Subnetting Math Step-by-Step (`192.168.1.130/27`):\n1. Host bits = 32 - 27 = 5 bits.\n2. Total IP block size = 2^5 = 32 addresses.\n3. Subnet Mask = 255.255.255.224 (since 11100000 in binary = 224).\n4. Finding Subnet Boundaries: Subnet intervals are multiples of 32 (0, 32, 64, 96, 128, 160...).\n5. For host 130, the subnet is the 128-159 range:\n   - Network Address: `192.168.1.128` (all host bits 0)\n   - Broadcast Address: `192.168.1.159` (all host bits 1)\n   - First Usable Host IP: `192.168.1.129`\n   - Last Usable Host IP: `192.168.1.158`\n   - Total Usable Hosts = 32 - 2 = 30 hosts.",
        comparisonTable: {
          headers: ["CIDR Prefix", "Subnet Mask", "Total Addresses", "Usable Host Count", "Common Usage"],
          rows: [
            ["/24", "255.255.255.0", "256", "254", "Standard small business LAN"],
            ["/27", "255.255.255.224", "32", "30", "Cloud VPC micro-subnet"],
            ["/30", "255.255.255.252", "4", "2", "Point-to-point router links"],
            ["/32", "255.255.255.255", "1", "1 (Host route)", "Loopback interface / Single host"],
          ],
        },
        interviewWatchout:
          "Remember why 2 addresses are always subtracted: The all-zeros host address is the Network ID (represents the subnet itself), and the all-ones host address is the Directed Broadcast Address.",
      },
      {
        id: "cn-4-2",
        title: "IPv6, NAT, and Address Transition",
        moduleName: "4. Network Layer, Addressing, and Routing",
        readTime: "6 min read",
        summary:
          "IPv6 provides a 128-bit address space eliminating address exhaustion. Network Address Translation (NAT/PAT) allowed IPv4 to survive by multiplexing private subnets behind a single public IP.",
        keyInvariants: [
          "IPv6 uses 128 bits (3.4 × 10^38 addresses), hexadecimal notation separated by colons.",
          "Private IPv4 Ranges (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (non-routable on public Internet).",
          "Port Address Translation (PAT / NAT Overload): Maps {Private IP, Private Port} -> {Public IP, Public Port}.",
        ],
        detailedContent:
          "How NAT / PAT Works:\nWhen a laptop (`192.168.1.50:5000`) sends a packet to a web server (`142.250.190.46:443`):\n1. Gateway router replaces Source IP `192.168.1.50` with its own Public IP `203.0.113.1` and allocates a public port (e.g. `40001`).\n2. Router logs this mapping in its internal NAT Translation Table: `192.168.1.50:5000 <-> 203.0.113.1:40001`.\n3. When the web server replies to `203.0.113.1:40001`, the router looks up the NAT table, rewrites the destination back to `192.168.1.50:5000`, and forwards it on the LAN.\n\nIPv6 Advantages over IPv4:\n1. Colossal Address Space (340 undecillion addresses).\n2. Simplified 40-byte fixed header: removed checksum (handled by L2/L4) and fragmentation fields from base header.\n3. SLAAC (Stateless Address Autoconfiguration): Nodes generate their own IP address automatically without DHCP.\n4. No NAT required: restored end-to-end connectivity model.",
        interviewWatchout:
          "State clearly why NAT breaks peer-to-peer protocols (WebRTC, VoIP, BitTorrent): Two clients behind separate NAT routers cannot directly initiate connections to each other's private IP addresses, requiring STUN/TURN traversal servers.",
      },
      {
        id: "cn-4-3",
        title: "IP Datagrams, Fragmentation, and ICMP",
        moduleName: "4. Network Layer, Addressing, and Routing",
        readTime: "6 min read",
        summary:
          "The IPv4 header defines packet routing metadata and handles fragmentation when packet sizes exceed link Maximum Transmission Unit (MTU). ICMP provides network diagnostics (ping, traceroute).",
        keyInvariants: [
          "Maximum Transmission Unit (MTU): Largest packet size supported by physical link (typically 1500 bytes for Ethernet).",
          "IPv4 Header Flags: DF (Don't Fragment) and MF (More Fragments).",
          "Fragment Offset: Expressed in units of 8-byte blocks; dictates where a fragment fits in the reconstructed datagram.",
          "ICMP operates at Layer 3: Type 8 (Echo Request) and Type 0 (Echo Reply) power ping; TTL Expired powers traceroute.",
        ],
        detailedContent:
          "IP Fragmentation Mechanics:\nWhen an IP packet of 4000 bytes arrives at a router with an outbound link MTU of 1500 bytes:\n- The router fragments the packet into multiple smaller chunks.\n- Each fragment copies the original IP Identification number.\n- `MF = 1` for all fragments except the final one (`MF = 0`).\n- `Fragment Offset` = byte position divided by 8.\n- If `DF = 1` and packet exceeds MTU, the router drops the packet and sends back an ICMP Type 3 Code 4 error (`Destination Unreachable, Fragmentation Needed`).\n\nHow Traceroute Works:\n1. Sends packet with `TTL = 1`. First router decrements TTL to 0, drops packet, and sends back `ICMP Time Exceeded (Type 11)`. Traceroute records Router 1's IP and RTT.\n2. Sends packet with `TTL = 2`. Second router decrements to 0, sends ICMP Time Exceeded. Records Router 2.\n3. Repeats incrementally until destination host is reached.",
        interviewWatchout:
          "Why is IP fragmentation avoided in modern networking? Because if a single fragment is dropped on the wire, the entire original 4000-byte datagram must be retransmitted by TCP. Modern systems use Path MTU Discovery (PMTUD) to negotiate packet sizes below link limits.",
      },
      {
        id: "cn-4-4",
        title: "Router Architecture, Forwarding, and Longest Prefix Match",
        moduleName: "4. Network Layer, Addressing, and Routing",
        readTime: "6 min read",
        summary:
          "Routing is the Control Plane computing optimal global paths; Forwarding is the Data Plane moving packets from input ports to output ports via hardware Longest Prefix Match (LPM).",
        keyInvariants: [
          "Control Plane: Software-based, computes routing tables (RIB) via dynamic protocols (OSPF, BGP).",
          "Data Plane (Forwarding): Hardware-based (ASIC/TCAM), moves packets at line rate using Forwarding Information Base (FIB).",
          "Longest Prefix Match (LPM): When multiple routing table entries match a destination IP, the router chooses the one with the LONGEST subnet mask.",
        ],
        detailedContent:
          "Longest Prefix Match Rule:\nSuppose a router's forwarding table contains:\n- Route A: `192.168.0.0/16` -> Outbound Interface 1\n- Route B: `192.168.1.0/24` -> Outbound Interface 2\n- Route C: `192.168.1.128/25` -> Outbound Interface 3\n- Default: `0.0.0.0/0` -> Outbound Interface 4\n\nA packet arrives for destination `192.168.1.130`:\nAll four entries match! However, Route C has a prefix length of 25 bits, which is more specific than 24 bits, 16 bits, or 0 bits. The router forwards out of Interface 3.\n\nHardware Implementation:\nHigh-speed core routers implement LPM in Ternary Content Addressable Memory (TCAM), searching hundreds of thousands of prefix routes in parallel in a single clock cycle (sub-nanosecond lookup).",
        interviewWatchout:
          "Always highlight the Control Plane vs Data Plane distinction: The Control Plane is the 'brain' (calculates paths in milliseconds/seconds); the Data Plane is the 'muscle' (forwards packets in hardware at nanosecond wire speeds).",
      },
      {
        id: "cn-4-5",
        title: "Dynamic Routing Protocols",
        moduleName: "4. Network Layer, Addressing, and Routing",
        readTime: "7 min read",
        summary:
          "Interior Gateway Protocols (OSPF, RIP) route traffic within an Autonomous System (AS). Border Gateway Protocol (BGP) is the path-vector protocol connecting the global Internet across Autonomous Systems.",
        keyInvariants: [
          "Autonomous System (AS): A collection of IP networks under unified administrative control.",
          "Distance Vector (RIP): Bellman-Ford algorithm; shares distance vectors with immediate neighbors; count-to-infinity problem.",
          "Link State (OSPF): Dijkstra's Shortest Path First algorithm; floods link-state advertisements (LSAs); all routers hold complete topology map.",
          "Path Vector (BGP): Connects distinct ASes using policy-based routing and AS-Path attributes to prevent routing loops.",
        ],
        detailedContent:
          "Routing Protocol Classification:\n\n1. OSPF (Open Shortest Path First - Intra-AS):\n- Protocol Type: Link-State.\n- Metric: Cost (inversely proportional to link bandwidth: `100 Mbps / Bandwidth`).\n- Convergence: Ultra-fast. Every router builds a complete directed graph of the network and independently runs Dijkstra's algorithm.\n- Hierarchy: Divided into OSPF Areas with Area 0 (Backbone Area) at the core.\n\n2. BGP (Border Gateway Protocol - Inter-AS):\n- The glue of the global Internet. Runs over reliable TCP port 179.\n- Path-Vector: Advertises reachable IP prefixes alongside the list of Autonomous Systems the advertisement has traversed (`AS-Path: [AS701, AS1239, AS15169]`).\n- Loop Prevention: If an AS sees its own AS number in the advertised `AS-Path`, it discards the route.\n- Policy-Driven: Routes are chosen based on commercial peering agreements and business relationships (customer vs peer vs transit provider), not shortest physical hop count.",
        interviewWatchout:
          "Why does BGP use policy-based routing instead of shortest path? Because on the global Internet, ISP A might refuse to transit ISP B's traffic across its expensive trans-oceanic fiber unless ISP B pays transit fees.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 5: Data Link Layer and LAN Services (5 Topics)
  // ----------------------------------------------------
  {
    id: "cn-mod-5",
    name: "5. Data Link Layer and LAN Services",
    topics: [
      {
        id: "cn-5-1",
        title: "Framing, Error Detection, and Correction",
        moduleName: "5. Data Link Layer and LAN Services",
        readTime: "6 min read",
        summary:
          "The Data Link Layer packages network packets into frames, detects physical bit errors via Checksums and Cyclic Redundancy Checks (CRC), and corrects errors using Hamming Codes.",
        keyInvariants: [
          "Framing encapsulates packets with delimiters using Byte Stuffing or Bit Stuffing.",
          "CRC (Cyclic Redundancy Check) uses modulo-2 polynomial division to detect burst errors with mathematical certainty.",
          "Parity and Checksums detect errors but cannot correct them; Hamming distance determines detection (d) and correction (⌊(d-1)/2⌋) limits.",
        ],
        detailedContent:
          "Framing & Bit Stuffing:\nTo mark frame boundaries, protocols use special flag bytes (e.g. `01111110`). If the user payload contains five consecutive 1s (`011111`), the transmitter automatically inserts ('stuffs') a 0 bit (`0111110`) to prevent false frame boundary detection.\n\nCyclic Redundancy Check (CRC):\n1. Sender and receiver agree on an (n+1)-bit generator polynomial G(x).\n2. Sender appends n zero bits to data D.\n3. Sender divides (D * 2^n) by G using Modulo-2 arithmetic (XOR addition/subtraction).\n4. The remainder R is the CRC checksum appended to the transmitted frame.\n5. Receiver divides the incoming frame by G. If remainder is 0, no bit errors occurred!",
        interviewWatchout:
          "Explain why Ethernet uses CRC-32 instead of simple addition checksums: Simple checksums (like Internet Checksum) fail to detect byte transpositions or swapped bit positions; CRC-32 detects all odd numbers of errors and all burst errors up to 32 bits.",
      },
      {
        id: "cn-5-2",
        title: "Medium Access Control",
        moduleName: "5. Data Link Layer and LAN Services",
        readTime: "6 min read",
        summary:
          "MAC protocols arbitrate access to shared transmission media. CSMA/CD handles wired Ethernet collisions, while CSMA/CA manages wireless avoidance via random backoff and RTS/CTS.",
        keyInvariants: [
          "Pure Aloha max throughput = 18.4%; Slotted Aloha max throughput = 36.8% (1/e).",
          "CSMA/CD (Carrier Sense Multiple Access with Collision Detection): Listen before talk, listen while talking, backoff on collision.",
          "Ethernet Minimum Frame Size (64 bytes) guarantees that collisions are detected before transmission finishes.",
        ],
        detailedContent:
          "CSMA/CD Mechanics (Wired Ethernet):\n1. Carrier Sense: Listen to channel. If busy, wait until idle.\n2. Transmit: Begin sending frame bits.\n3. Collision Detection: While transmitting, monitor signal voltage. If voltage exceeds threshold, a collision occurred!\n4. Jam Signal & Exponential Backoff: Broadcast a 32-bit jam signal so all nodes detect collision, then wait a random duration determined by Binary Exponential Backoff: `wait = R * 512 bit-times`, where `R ∈ [0, 2^k - 1]` (k is collision attempt number).\n\nWhy Minimum Frame Size is Mandatory:\nIf a frame is too small, a host could finish transmitting the entire frame before the collision wavefront arrives back from a far-away host. The sender would believe the frame succeeded and discard its copy, breaking retransmission!",
        interviewWatchout:
          "Know the minimum frame size equation: `t_frame >= 2 * t_prop`. Minimum frame size = `2 * Propagation_Delay * Bandwidth` (Round-Trip Propagation Time).",
      },
      {
        id: "cn-5-3",
        title: "Ethernet Frames, MAC Addressing, and LAN Switching",
        moduleName: "5. Data Link Layer and LAN Services",
        readTime: "6 min read",
        summary:
          "Ethernet (IEEE 802.3) frames carry 48-bit MAC addresses. Layer 2 switches learn source MACs dynamically to populate CAM tables and forward frames without flooding.",
        keyInvariants: [
          "MAC Address: 48 bits (6 bytes, e.g. 00:1A:2B:3C:4D:5E). First 24 bits = OUI (vendor), last 24 bits = device serial.",
          "Switch Learning Algorithm: Inspects Source MAC to update CAM table; forwards based on Destination MAC.",
          "Broadcast MAC (`FF:FF:FF:FF:FF:FF`) and unknown destination unicast frames are flooded to all ports except ingress.",
        ],
        detailedContent:
          "Ethernet Frame Format (802.3):\n- Preamble (7 bytes) + Start of Frame Delimiter (1 byte) for clock synchronization.\n- Destination MAC (6 bytes).\n- Source MAC (6 bytes).\n- EtherType / Length (2 bytes, e.g. `0x0800` for IPv4, `0x0806` for ARP).\n- Payload (46 to 1500 bytes).\n- Frame Check Sequence (4 bytes CRC-32).\n\nSwitch Learning Process:\n1. Frame arrives on Port 2 with `Src: MAC_A, Dst: MAC_B`.\n2. Switch checks CAM table: records `MAC_A -> Port 2` with timestamp.\n3. Switch checks CAM table for `MAC_B`:\n   - Known: Forwards directly out matching port.\n   - Unknown: Floods frame out all ports except Port 2 (Unknown Unicast Flooding).",
        interviewWatchout:
          "Why is a MAC address needed if we already have an IP address? IP addresses represent logical locations in a global routing hierarchy (like a postal ZIP code); MAC addresses represent local physical interface identities on a shared wire (like a recipient's social security number).",
      },
      {
        id: "cn-5-4",
        title: "Address Resolution Protocol (ARP) and Local Delivery",
        moduleName: "5. Data Link Layer and LAN Services",
        readTime: "6 min read",
        summary:
          "ARP resolves known 32-bit IPv4 addresses to local 48-bit physical MAC addresses via broadcast requests and unicast replies, cached in local kernel ARP tables.",
        keyInvariants: [
          "ARP Request: L2 Broadcast (`FF:FF:FF:FF:FF:FF`) asking 'Who has IP X? Tell IP Y.'",
          "ARP Reply: L2 Unicast sent directly back from target host containing its hardware MAC address.",
          "ARP operates strictly within the local broadcast domain; ARP requests never cross routers.",
        ],
        detailedContent:
          "ARP Resolution Lifecycle:\nWhen Host A (`192.168.1.10`) wants to send an IP packet to Host B (`192.168.1.20`):\n1. Host A checks local ARP Cache (`arp -a`). If entry exists, frames are sent immediately.\n2. Cache Miss: Host A constructs an ARP Request frame with destination MAC `FF:FF:FF:FF:FF:FF`.\n3. The switch floods the broadcast frame to all connected ports.\n4. Host B recognizes its own IP, updates its ARP cache with Host A's mapping, and sends an ARP Reply unicast directly to Host A's MAC.\n5. Host A caches Host B's MAC and transmits the waiting IP packet.\n\nARP Spoofing / Poisoning:\nARP has no authentication. An attacker on the local network can broadcast unsolicited (gratuitous) ARP replies claiming to own the IP address of the default gateway, intercepting all outbound network traffic (Man-In-The-Middle attack).",
        codeSnippet: {
          language: "bash",
          code: `# Inspect kernel ARP cache table
$ arp -a
? (192.168.1.1) at 00:50:56:c0:00:08 on en0 ifscope [ethernet]
? (192.168.1.25) at e4:5f:01:4d:92:aa on en0 ifscope [ethernet]

# Send gratuitous ARP broadcast or clear cache
$ sudo ip -s -s neigh flush all`,
        },
        interviewWatchout:
          "If Host A wants to send a packet to a remote web server on the Internet (`142.250.190.46`), what MAC address does it put in the destination field of the Ethernet frame? NOT the Google server's MAC! It puts the MAC address of its DEFAULT GATEWAY (local router).",
      },
      {
        id: "cn-5-5",
        title: "VLANs and Spanning Tree Protocol (STP)",
        moduleName: "5. Data Link Layer and LAN Services",
        readTime: "6 min read",
        summary:
          "VLANs partition physical switches into multiple logical broadcast domains (IEEE 802.1Q). Spanning Tree Protocol (STP / 802.1D) disables redundant switch links to prevent catastrophic broadcast storms.",
        keyInvariants: [
          "VLAN (802.1Q) inserts a 4-byte tag (including 12-bit VLAN ID, supporting up to 4094 VLANs) into the Ethernet header.",
          "Access Port carries traffic for a single untagged VLAN; Trunk Port carries traffic for multiple tagged VLANs.",
          "STP calculates a loop-free logical spanning tree by electing a Root Bridge and blocking redundant switch ports.",
        ],
        detailedContent:
          "Why Broadcast Storms Destroy Networks:\nIf switches are connected in a physical loop for redundancy without STP, a single broadcast frame (like an ARP request) will be endlessly duplicated and forwarded around the loop by every switch. Because Ethernet headers have no TTL counter, broadcast frames circulate infinitely, consuming 100% bandwidth and crashing switch CPU backplanes within seconds.\n\nSpanning Tree Protocol (STP 802.1D) Algorithm:\n1. Elect Root Bridge: The switch with the lowest Bridge ID (Priority + MAC address) becomes the Root.\n2. Select Root Ports: Every non-root switch chooses one port with the lowest path cost to the Root Bridge.\n3. Select Designated Ports: One port per network segment responsible for forwarding traffic toward the root.\n4. Block Alternate Ports: All other redundant ports are placed in a `BLOCKING` state, eliminating loops while providing automatic failover if an active link fails.",
        interviewWatchout:
          "Know the role of an 802.1Q Trunk Port: Inter-switch links between switches require trunk ports to multiplex traffic for dozens of VLANs across a single physical cable by injecting the 802.1Q VLAN tag.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 6: Wireless Networks and Transmission Media (5 Topics)
  // ----------------------------------------------------
  {
    id: "cn-mod-6",
    name: "6. Wireless Networks and Transmission Media",
    topics: [
      {
        id: "cn-6-1",
        title: "Transmission Media and Physical Signals",
        moduleName: "6. Wireless Networks and Transmission Media",
        readTime: "6 min read",
        summary:
          "Data transmission relies on guided media (twisted pair, coaxial, optical fiber) and unguided wireless RF signals. Fundamental physical laws (Nyquist and Shannon) dictate maximum channel capacity.",
        keyInvariants: [
          "Nyquist Theorem (Noiseless Channel): Maximum Bit Rate = 2 * B * log2(V) bits/sec.",
          "Shannon Capacity Theorem (Noisy Channel): Maximum Channel Capacity C = B * log2(1 + SNR) bits/sec.",
          "Optical fiber achieves near-infinite bandwidth-distance products via Total Internal Reflection in single-mode glass cores.",
        ],
        detailedContent:
          "Theoretical Limits of Information Transmission:\n\n1. Nyquist Bit Rate:\nFor a noiseless channel with bandwidth B (Hz) and discrete signal voltage levels V:\n`C = 2 * B * log2(V)`.\nIndicates that capacity can be increased by packing more signal levels into each symbol (e.g. 256-QAM).\n\n2. Shannon Capacity Theorem:\nReal physical channels contain thermal Gaussian noise. The maximum theoretical data rate is strictly bounded by signal-to-noise ratio (SNR):\n`C = B * log2(1 + S/N)`.\nEven with infinite signal voltage levels, noise introduces errors that cap channel capacity.\n\nPhysical Guided Media:\n- Unshielded Twisted Pair (Cat6/Cat6a): Copper pairs twisted to cancel electromagnetic interference (EMI) and crosstalk. 10 Gbps up to 55-100 meters.\n- Fiber Optic: Pulses of infrared light traversing pure silica glass. Immune to electrical interference. Single-Mode Fiber (SMF) carries laser signals over 40-100 kilometers without repeaters.",
        interviewWatchout:
          "Calculate Shannon capacity when SNR is given in decibels (dB): Remember that `SNR_dB = 10 * log10(S/N)`. If SNR is 30 dB, the absolute ratio `S/N = 10^(30/10) = 1000`.",
      },
      {
        id: "cn-6-2",
        title: "Wi-Fi Architecture and IEEE 802.11 Standards",
        moduleName: "6. Wireless Networks and Transmission Media",
        readTime: "6 min read",
        summary:
          "IEEE 802.11 defines wireless local area networks (WLAN). Infrastructure mode coordinates stations (STAs) via Access Points (APs) forming a Basic Service Set (BSS).",
        keyInvariants: [
          "Basic Service Set (BSS): One Access Point (AP) and associated wireless client stations (STAs).",
          "Extended Service Set (ESS): Multiple BSSs interconnected via an Ethernet Distribution System sharing an SSID for seamless roaming.",
          "Evolution: 802.11n (Wi-Fi 4) -> 802.11ac (Wi-Fi 5) -> 802.11ax (Wi-Fi 6/6E) -> 802.11be (Wi-Fi 7).",
        ],
        detailedContent:
          "Wi-Fi Generations Evolution:\n- 802.11n (Wi-Fi 4, 2009): Introduced MIMO (Multiple Input, Multiple Output) and 40 MHz channel bonding on 2.4 GHz and 5 GHz bands. Rates up to 600 Mbps.\n- 802.11ac (Wi-Fi 5, 2013): 5 GHz only, 80/160 MHz channels, 256-QAM modulation, Multi-User MIMO (MU-MIMO) downstream. Rates up to 6.9 Gbps.\n- 802.11ax (Wi-Fi 6 / 6E, 2019): Introduced OFDMA (Orthogonal Frequency Division Multiple Access), 1024-QAM, Target Wake Time (TWT) for IoT battery savings, and the 6 GHz spectrum band. Designed for high client density.\n- 802.11be (Wi-Fi 7, 2024): 320 MHz channels, 4096-QAM, Multi-Link Operation (MLO) allowing devices to transmit across 2.4, 5, and 6 GHz bands simultaneously.",
        comparisonTable: {
          headers: ["Standard", "Marketing Name", "Frequency Bands", "Channel Width", "Max Theoretical PHY Rate"],
          rows: [
            ["802.11n", "Wi-Fi 4", "2.4 GHz, 5 GHz", "20, 40 MHz", "600 Mbps"],
            ["802.11ac", "Wi-Fi 5", "5 GHz", "20, 40, 80, 160 MHz", "6.9 Gbps"],
            ["802.11ax", "Wi-Fi 6 / 6E", "2.4 GHz, 5 GHz, 6 GHz", "20, 40, 80, 160 MHz", "9.6 Gbps"],
            ["802.11be", "Wi-Fi 7", "2.4 GHz, 5 GHz, 6 GHz", "Up to 320 MHz", "46 Gbps"],
          ],
        },
        interviewWatchout:
          "Explain why Wi-Fi 6 prioritizes efficiency over raw speed: Wi-Fi 6 focuses on high-density performance (airports, stadiums) by replacing single-user OFDM with multi-user OFDMA, subdividing channels to serve multiple clients concurrently.",
      },
      {
        id: "cn-6-3",
        title: "Wireless Multiplexing and Capacity",
        moduleName: "6. Wireless Networks and Transmission Media",
        readTime: "6 min read",
        summary:
          "Advanced physical layer techniques multiply wireless capacity: OFDM divides channels into orthogonal subcarriers, OFDMA assigns subcarrier groups per user, and MIMO exploits multi-path spatial streams.",
        keyInvariants: [
          "OFDM (Orthogonal Frequency Division Multiplexing): Transmits data across hundreds of closely spaced orthogonal subcarriers to combat multi-path fading.",
          "OFDMA: Multi-user variant dividing channel into Resource Units (RUs), serving multiple low-latency clients concurrently.",
          "MIMO (Multiple Input Multiple Output): Uses multiple transmit and receive antennas to send independent data streams simultaneously over the same frequency.",
        ],
        detailedContent:
          "Multiplexing Breakthroughs in Modern Wireless:\n\n1. Spatial Multiplexing (MIMO):\nInstead of multi-path reflections being destructive interference, MIMO treats reflections as distinct spatial paths. An `8x8 MIMO` system transmits 8 separate data streams on the exact same frequency channel, multiplying throughput by a factor of 8 without consuming extra radio spectrum.\n\n2. Beamforming:\nAntenna arrays dynamically adjust signal phase and amplitude to construct constructive interference focused directly toward the receiving device's coordinates, rather than radiating radio energy in an inefficient 360-degree sphere.\n\n3. QAM (Quadrature Amplitude Modulation):\nModulates both amplitude and phase of the RF carrier. While 64-QAM carries 6 bits per symbol, 4096-QAM (Wi-Fi 7) packs 12 bits per symbol, demanding high signal-to-noise ratios (close proximity to AP).",
        interviewWatchout:
          "Distinguish between Diversity MIMO (sending the same data across antennas to improve reliability/range) and Spatial Multiplexing MIMO (sending distinct data streams across antennas to multiply throughput).",
      },
      {
        id: "cn-6-4",
        title: "Wi-Fi Access, Bands, Channels, and Hidden Node Problem",
        moduleName: "6. Wireless Networks and Transmission Media",
        readTime: "6 min read",
        summary:
          "Wireless networks cannot detect collisions while transmitting. CSMA/CA avoids collisions, while RTS/CTS (Request to Send / Clear to Send) resolves the Hidden Node Problem.",
        keyInvariants: [
          "Collision Detection (CD) is physically impossible in wireless: local transmit power drowns out distant incoming signals by 100 dB (10 billion times).",
          "CSMA/CA uses Inter-Frame Spacing (DIFS/SIFS), random backoff windows, and explicit ACKs.",
          "Hidden Node Problem: Node A and Node C cannot hear each other, but both transmit to central AP B simultaneously, causing collisions at B.",
        ],
        detailedContent:
          "The Hidden Node Problem & RTS/CTS Handshake:\nSuppose Station A is on the far left of AP B, and Station C is on the far right. A and C are out of radio range of each other, but both are within range of AP B.\nIf A and C perform carrier sense, both hear an idle channel and transmit simultaneously. Their signals collide at AP B!\n\nRTS/CTS Solution:\n1. Station A transmits a short `RTS` (Request to Send) frame to AP B.\n2. AP B broadcasts a `CTS` (Clear to Send) frame.\n3. Station C hears the CTS broadcast from AP B (which contains a Network Allocation Vector - NAV timer telling C how long A will transmit).\n4. Station C silences its radio for the duration. Station A transmits its data frame collision-free!\n\nWi-Fi Bands Comparison:\n- 2.4 GHz Band: High range, passes through concrete walls easily, but only 3 non-overlapping channels (1, 6, 11); heavily congested by Bluetooth and microwaves.\n- 5 GHz Band: Higher bandwidth, 24 non-overlapping channels, but shorter range and attenuated by walls.\n- 6 GHz Band (Wi-Fi 6E/7): Pristine, ultra-wide 160/320 MHz channels with zero legacy interference.",
        interviewWatchout:
          "Why is RTS/CTS not enabled for every single Wi-Fi frame? Because the RTS/CTS frame exchange introduces latency overhead. Routers only activate RTS/CTS for packets exceeding an 'RTS Threshold' (typically frames > 2347 bytes).",
      },
      {
        id: "cn-6-5",
        title: "Wi-Fi Security",
        moduleName: "6. Wireless Networks and Transmission Media",
        readTime: "6 min read",
        summary:
          "Wireless frames propagate through open air, requiring cryptographic encryption. Security protocols have evolved from broken WEP and WPA to WPA2 (AES-CCMP) and modern WPA3 (SAE).",
        keyInvariants: [
          "WEP (Wired Equivalent Privacy): Cryptographically broken due to short 24-bit initialization vectors (IVs) and RC4 key reuse.",
          "WPA2: Uses robust AES encryption in Counter Mode with CBC-MAC (CCMP); vulnerable to offline 4-way handshake dictionary attacks (KRACK).",
          "WPA3: Replaces Pre-Shared Key (PSK) with Simultaneous Authentication of Equals (SAE Dragonfly handshake), providing forward secrecy and resistance to offline brute-force attacks.",
        ],
        detailedContent:
          "Evolution of Wireless Security:\n\n1. WEP (1997):\nUsed RC4 stream cipher with static keys and 24-bit IVs. Because IVs repeated every 16 million frames, passive listeners could crack WEP passwords in minutes.\n\n2. WPA2-Personal (2004):\nReplaced RC4 with AES-128. Authentication uses a 4-Way Handshake with a Pre-Shared Key (PSK).\n- Flaw: Attackers can capture the 4-way handshake over the air and execute offline dictionary attacks at billions of guesses per second on GPU clusters without interacting with the network.\n\n3. WPA3 (2018):\n- Simultaneous Authentication of Equals (SAE): A zero-knowledge proof Dragonfly handshake. Attackers cannot test password guesses offline!\n- Forward Secrecy: Even if an attacker learns the network password in the future, they cannot decrypt previously recorded traffic.\n- Protected Management Frames (PMF): Obligatory protection against Wi-Fi de-authentication disconnect attacks.",
        interviewWatchout:
          "Explain why WPA3 protects users on public coffee shop Wi-Fi: Even without a network password, WPA3 uses Opportunistic Wireless Encryption (OWE) to establish unique, individual per-session encryption keys for every connected client.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 7: Network Security, Firewalls, and VPNs (5 Topics)
  // ----------------------------------------------------
  {
    id: "cn-mod-7",
    name: "7. Network Security, Firewalls, and VPNs",
    topics: [
      {
        id: "cn-7-1",
        title: "Network Security Principles",
        moduleName: "7. Network Security, Firewalls, and VPNs",
        readTime: "6 min read",
        summary:
          "Network security enforces the CIA Triad (Confidentiality, Integrity, Availability) across distributed perimeters through Defense-in-Depth multi-layered architectures.",
        keyInvariants: [
          "Confidentiality: Data is accessible only to authorized entities; enforced via symmetric and asymmetric encryption.",
          "Integrity: Data cannot be tampered with or modified in transit undetected; enforced via cryptographic hashes (SHA-256) and HMACs.",
          "Availability: Services remain operational and accessible under adversarial conditions; defended via Anycast and DDoS mitigation.",
        ],
        detailedContent:
          "The Threat Landscape:\n- Eavesdropping / Packet Sniffing: Passive interception of plaintext traffic on shared media.\n- Man-In-The-Middle (MITM): Intercepting and altering packets between communicating endpoints via ARP spoofing or rogue DNS.\n- Distributed Denial of Service (DDoS): Flooding network links or application servers with millions of spoofed packets (SYN floods, UDP amplification, HTTP floods) to exhaust resources.\n\nDefense-in-Depth Strategy:\nSecurity should never rely on a single perimeter wall. Layered defenses include:\n1. Edge / Perimeter: Anycast DDoS scrubbing (Cloudflare, AWS Shield), Next-Gen Firewalls.\n2. Network Segregation: Micro-segmentation with VLANs, subnets, and Zero-Trust Network Access (ZTNA).\n3. Host Level: Host-based firewalls (iptables/nftables), OS kernel hardening.\n4. Application Level: TLS 1.3 encryption, mutual TLS (mTLS), strict input validation, least-privilege IAM roles.",
        interviewWatchout:
          "Never define security as just 'encryption'. Emphasize Authentication (verifying identity), Authorization (enforcing permissions), and Non-Repudiation (cryptographic proof that an action was performed by the sender via digital signatures).",
      },
      {
        id: "cn-7-2",
        title: "Firewalls and Packet Filtering",
        moduleName: "7. Network Security, Firewalls, and VPNs",
        readTime: "6 min read",
        summary:
          "Firewalls control traffic crossing network perimeters. Stateless firewalls inspect individual packet headers; Stateful firewalls track TCP connection state; NGFWs inspect L7 payloads.",
        keyInvariants: [
          "Stateless Packet Filter: Evaluates each packet in isolation against an Access Control List (ACL) based on 5-tuple; zero memory of previous packets.",
          "Stateful Inspection Firewall: Tracks TCP handshake states (SYN, ESTABLISHED) and connection tracking tables; automatically allows return traffic.",
          "Next-Generation Firewall (NGFW): Deep Packet Inspection (DPI) at Layer 7, detecting specific applications and malware signatures regardless of port number.",
        ],
        detailedContent:
          "Firewall Generations:\n\n1. Stateless Packet Filter (e.g. Cisco ACLs, raw router rules):\nInspects packet headers: Source IP, Dest IP, Protocol, Source Port, Dest Port.\nFlaw: Cannot tell if an incoming packet on port 80 is a legitimate response to an internal web request or an unsolicited attack from the outside.\n\n2. Stateful Inspection Firewall (e.g. Linux iptables/conntrack, pfSense):\nMaintains a dynamic Connection Tracking State Table.\nWhen an internal host sends an outbound TCP SYN, the firewall records the connection. When the external server responds with SYN-ACK, the firewall matches it against the table and permits it through. Unsolicited inbound packets with SYN set are dropped instantly.\n\n3. Application-Level Proxy / NGFW (e.g. Palo Alto, Fortinet):\nReassembles Layer 7 application payloads. Can distinguish between legitimate Slack chat messages and file transfers, block SQL injection strings inside HTTP POST bodies, and detect TLS-encrypted malware using SSL Decryption inspection.",
        codeSnippet: {
          language: "bash",
          code: `# Linux iptables stateful firewall configuration example
# Allow established and related return traffic
$ iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow inbound SSH on port 22
$ iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -j ACCEPT

# Default policy: DROP all other unsolicited incoming traffic
$ iptables -P INPUT DROP`,
        },
        interviewWatchout:
          "Why do attackers use port 443 for command-and-control (C2) botnets? Because traditional stateful firewalls permit all outbound port 443 traffic blindly. This demonstrates why Next-Generation Firewalls (NGFW) with Layer 7 Deep Packet Inspection are required.",
      },
      {
        id: "cn-7-3",
        title: "Intrusion Detection and Prevention Systems (IDS / IPS)",
        moduleName: "7. Network Security, Firewalls, and VPNs",
        readTime: "6 min read",
        summary:
          "IDS monitors network traffic out-of-band and alerts on suspicious activity. IPS sits in-line on network links and actively blocks malicious packets in real time.",
        keyInvariants: [
          "IDS (Intrusion Detection System): Passive (out-of-band) listener via SPAN/mirror ports; generates alerts without introducing latency.",
          "IPS (Intrusion Prevention System): Active (in-line) inspection; drops malicious packets immediately, but introduces inline processing latency.",
          "Signature-Based Detection matches known vulnerability patterns; Anomaly-Based Detection flags statistical deviations from baseline behavior.",
        ],
        detailedContent:
          "Detection Methodologies:\n1. Signature-Based Detection:\nCompares incoming byte streams against databases of known attack signatures (e.g. Snort or Suricata rules for Log4j or Heartbleed).\n- Pro: Extremely fast, zero false positives on known attacks.\n- Con: Completely blind to novel zero-day attacks and polymorphic shellcode.\n\n2. Anomaly-Based / Heuristic Detection:\nEstablishes a baseline of normal network behavior (typical bandwidth, port distributions, packet sizes, protocol headers). Flags deviations exceeding thresholds.\n- Pro: Capable of detecting brand-new zero-day exploits.\n- Con: Higher rate of false positives (e.g. flagging a legitimate sudden marketing traffic spike as a DDoS attack).\n\nDeployment Topologies:\n- Host-based (HIDS/HIPS): Installed on specific servers (e.g. OSSEC, Wazuh); inspects local system calls, log files, and kernel rootkits.\n- Network-based (NIDS/NIPS): Placed at network aggregation points or behind firewalls to inspect inter-subnet traffic.",
        interviewWatchout:
          "Explain the operational risk of an in-line IPS: A false positive in an IPS actively drops legitimate customer traffic or business transactions, potentially taking down production services.",
      },
      {
        id: "cn-7-4",
        title: "Virtual Private Networks (VPNs)",
        moduleName: "7. Network Security, Firewalls, and VPNs",
        readTime: "6 min read",
        summary:
          "A Virtual Private Network (VPN) creates an encrypted virtual tunnel over untrusted public networks, extending private network access securely across the Internet.",
        keyInvariants: [
          "Remote-Access VPN: Connects individual remote workers to enterprise corporate intranets securely.",
          "Site-to-Site VPN: Connects two permanent branch office networks across the Internet as if connected by private leased lines.",
          "Split Tunneling: Routes only corporate intranet traffic through VPN; general web browsing bypasses the tunnel directly to the Internet.",
        ],
        detailedContent:
          "VPN Architectures:\n1. Site-to-Site VPN:\n- Established between two edge gateway routers/firewalls (e.g., Headquarters and European Branch Office).\n- Endpoints inside the LANs communicate using private IP addresses (e.g. `10.1.0.5` talks to `10.2.0.8`) with zero VPN software installed on client machines. The edge routers transparently encrypt and encapsulate packets across the public Internet.\n\n2. Remote-Access VPN:\n- A software client (OpenVPN, Cisco AnyConnect, WireGuard) runs on a remote laptop.\n- The client creates a virtual network interface (TUN/TAP adapter) and encrypts all outbound traffic directed to corporate subnets.\n\nSplit Tunneling vs Full Tunneling:\n- Full Tunneling: 100% of user traffic (including YouTube and Netflix) is encrypted and routed through corporate firewalls. High bandwidth cost for enterprise; ensures maximum security.\n- Split Tunneling: Only traffic destined for corporate subnets (`10.0.0.0/8`) traverses the VPN tunnel. General internet traffic routes directly via the user's home ISP.",
        interviewWatchout:
          "Identify the security tradeoff of Split Tunneling: While it saves company bandwidth, an infected remote employee laptop can act as a bridge, allowing malware from the public Internet to bypass corporate edge firewalls into the private intranet.",
      },
      {
        id: "cn-7-5",
        title: "Tunneling Protocols and Cryptography",
        moduleName: "7. Network Security, Firewalls, and VPNs",
        readTime: "6 min read",
        summary:
          "VPN tunneling protocols encapsulate and encrypt traffic across untrusted paths. Modern protocols include IPsec (AH/ESP), OpenVPN (TLS over UDP), and WireGuard (Noise protocol).",
        keyInvariants: [
          "Encapsulating Security Payload (ESP): Provides confidentiality, data origin authentication, and anti-replay protection.",
          "IPsec Tunnel Mode: Encrypts the entire original IP packet (header + payload) inside a brand-new outer IP header.",
          "WireGuard: Minimalist (~4,000 lines of code) modern VPN protocol utilizing ChaCha20-Poly1305 and Curve25519, dramatically outperforming legacy IPsec.",
        ],
        detailedContent:
          "IPsec Suite Deep Dive:\n- Authentication Header (AH): Provides data integrity and origin authentication, but NO encryption (plaintext). Rarely used today.\n- Encapsulating Security Payload (ESP): Provides both strong encryption (AES-GCM) and integrity.\n\nIPsec Modes:\n1. Transport Mode: Encrypts only the IP payload; the original IP header remains visible. Used for host-to-host direct secure connections.\n2. Tunnel Mode: Encrypts the entire original IP packet (both original IP header and payload). Prepends a new public router IP header. Essential for Site-to-Site VPNs!\n\nWireGuard Modern Revolution:\n- Legacy IPsec and OpenVPN contain hundreds of thousands of lines of code with complex cipher negotiation (IKEv1/IKEv2).\n- WireGuard is implemented in ~4,000 lines of kernel code, making security auditing straightforward.\n- Fixed modern cryptographic primitives: Curve25519 for ECDH key exchange, ChaCha20 for symmetric encryption, Poly1305 for authentication, and BLAKE2s for hashing.\n- Operates connectionlessly over UDP with instant roaming (changing from Wi-Fi to 5G maintains connection seamlessly).",
        comparisonTable: {
          headers: ["Protocol", "Codebase Size", "Cryptographic Agility", "Handshake Speed", "Throughput"],
          rows: [
            ["IPsec (IKEv2)", "100,000+ lines (complex)", "High (negotiates many ciphers)", "Multi-roundtrip IKE exchange", "High (kernel native)"],
            ["OpenVPN", "100,000+ lines", "High (uses OpenSSL suite)", "Slow (TLS handshake)", "Moderate (user-space context switches)"],
            ["WireGuard", "~4,000 lines (minimal)", "Fixed modern primitives", "Instant (1-RTT Noise IK)", "Highest (lean in-kernel processing)"],
          ],
        },
        interviewWatchout:
          "Why is WireGuard's lack of cryptographic agility considered an architectural feature rather than a flaw? Because eliminating cipher negotiation prevents downgrade attacks (where an attacker forces endpoints to fall back to weak ciphers like DES or MD5).",
      },
    ],
  },
];

// =========================================================================
// HIGH-YIELD MODULE REVISION SUMMARIES (7 MODULES)
// =========================================================================

export const NETWORKS_REVISE_SECTIONS: ReviseSection[] = [
  {
    title: "1. Networking Foundations, OSI & Packet Journey",
    summary:
      "Four delay components, circuit vs packet switching, the 7-layer OSI vs 4-layer TCP/IP models, packet encapsulation, and device layers.",
    bullets: [
      "Total Nodal Delay = Processing + Queuing + Transmission (L/R) + Propagation (d/s).",
      "PDU Taxonomy: Application = Message; Transport = Segment; Network = Packet; Data Link = Frame; Physical = Bits.",
      "Encapsulation prepends headers down the stack; IP addresses stay constant end-to-end (barring NAT), while MAC addresses change at every single hop.",
      "Hubs (L1: 1 collision / 1 broadcast domain); Switches (L2: 1 collision domain per port / 1 broadcast domain); Routers (L3: breaks both domains).",
    ],
    formulaOrCode:
      "Delay Formula: d_nodal = d_proc + d_queue + (L / R) + (d / s)",
  },
  {
    title: "2. Application Layer, Web Protocols & DNS",
    summary:
      "DNS hierarchical resolution flow, HTTP methods and status codes, HTTP/1.1 vs HTTP/2 vs HTTP/3 QUIC, and CDN caching rules.",
    bullets: [
      "DNS Hierarchy: Root (.) -> TLD (.com) -> Authoritative Nameserver. Primarily UDP port 53; falls back to TCP 53 for >512 bytes.",
      "Idempotent HTTP methods (GET, PUT, DELETE); Non-idempotent (POST). 401 is Unauthenticated; 403 is Unauthorized.",
      "HTTP/1.1 has application-level HoL blocking; HTTP/2 introduces binary multiplexing but suffers TCP packet loss HoL blocking.",
      "HTTP/3 over QUIC (UDP) completely eliminates transport-level head-of-line blocking and supports 0-RTT handshakes.",
      "Cache-Control: public, max-age, no-cache (validate first), no-store (never save).",
    ],
    formulaOrCode:
      "HTTP Evolution: HTTP/1.1 (ASCII text) -> HTTP/2 (Binary frames / TCP) -> HTTP/3 (QUIC / UDP)",
  },
  {
    title: "3. Transport Layer, TCP Mechanics & Congestion",
    summary:
      "Port multiplexing, TCP 3-way handshake and 4-way teardown, sliding window flow control, and TCP congestion control phases.",
    bullets: [
      "Sockets identified by 5-tuple: {Src IP, Src Port, Dst IP, Dst Port, Protocol}.",
      "TCP 3-Way Handshake: SYN(x) -> SYN-ACK(y, ack x+1) -> ACK(ack y+1). Synchronizes randomized ISNs.",
      "TIME_WAIT state lasts for 2 * MSL to guarantee delivery of final ACK and drain lingering duplicate segments.",
      "Flow control uses Receive Window (rwnd) to prevent buffer overflow; Congestion control uses Congestion Window (cwnd).",
      "Congestion Control: Slow Start (exponential growth to ssthresh) -> Congestion Avoidance (linear AIMD) -> Fast Retransmit / Recovery on 3 Dup ACKs.",
      "Google BBR measures bottleneck bandwidth and minimum RTT directly, bypassing loss-based AIMD.",
    ],
    formulaOrCode:
      "Allowed Inflight Bytes: Window = min(rwnd, cwnd)",
  },
  {
    title: "4. Network Layer, Subnetting & Routing Protocols",
    summary:
      "IPv4 CIDR subnetting math, IPv6 advantages, NAT/PAT translation, ICMP diagnostics, Longest Prefix Match, and OSPF vs BGP.",
    bullets: [
      "Subnetting: Host bits = 32 - N; Total hosts = 2^(32 - N) - 2 (subtract Network ID and Broadcast ID).",
      "Private IPv4: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. PAT maps {Private IP, Port} to {Public IP, Port}.",
      "ICMP operates at Layer 3: powers ping (Echo Request/Reply) and traceroute (incremental TTL expiration).",
      "Data Plane uses hardware TCAM to forward packets at line rate via Longest Prefix Match (LPM).",
      "OSPF (Link-State / Dijkstra within AS); BGP (Path-Vector / TCP port 179 / AS-Path loop prevention between ASes).",
    ],
    formulaOrCode:
      "Host Math: Hosts = 2^(32 - Prefix) - 2 | Subnet Mask: Prefix length in binary 1s",
  },
  {
    title: "5. Data Link Layer, MAC & Switching",
    summary:
      "Framing, bit stuffing, CRC polynomial division, CSMA/CD minimum frame size, switch CAM tables, ARP, and VLAN/STP.",
    bullets: [
      "CRC Modulo-2 division appends remainder R to payload; detects all single, odd, and burst errors up to polynomial degree.",
      "CSMA/CD: Minimum frame size = 2 * Propagation_Delay * Bandwidth (64 bytes for Ethernet).",
      "Switch CAM Learning: Learns Source MAC on ingress port; forwards by Destination MAC; floods unknown unicast and broadcast.",
      "ARP resolves IPv4 to MAC address using local broadcast requests; ARP spoofing mitigated via Dynamic ARP Inspection (DAI).",
      "802.1Q tags frames with 12-bit VLAN ID; STP (802.1D) blocks redundant switch ports to eliminate broadcast storms.",
    ],
    formulaOrCode:
      "CSMA/CD Condition: t_frame >= 2 * t_prop (Frame_Size / R >= 2 * Distance / Speed)",
  },
  {
    title: "6. Wireless Networks, Standards & Antennas",
    summary:
      "Physical signal capacity limits (Nyquist & Shannon), 802.11 standards progression, OFDM vs OFDMA, MIMO, and WPA3 security.",
    bullets: [
      "Shannon Capacity Theorem: C = B * log2(1 + S/N). SNR in dB: SNR_dB = 10 * log10(S/N).",
      "Wi-Fi Generations: Wi-Fi 4 (802.11n / MIMO) -> Wi-Fi 5 (802.11ac / 5GHz) -> Wi-Fi 6 (802.11ax / OFDMA) -> Wi-Fi 7 (802.11be / 320MHz).",
      "Collision detection is impossible in wireless; CSMA/CA uses RTS/CTS to solve the Hidden Node Problem.",
      "2.4 GHz penetrates walls better (channels 1, 6, 11); 5 GHz and 6 GHz provide massive non-overlapping bandwidth.",
      "WPA3 replaces PSK with Simultaneous Authentication of Equals (SAE Dragonfly handshake), eliminating offline dictionary attacks.",
    ],
    formulaOrCode:
      "Shannon Limit: C = B * log2(1 + SNR) | Nyquist Limit: C = 2 * B * log2(V)",
  },
  {
    title: "7. Network Security, Firewalls & VPN Architectures",
    summary:
      "CIA triad, Defense-in-Depth, stateless vs stateful vs Next-Gen firewalls, signature vs anomaly IDS/IPS, IPsec, and WireGuard.",
    bullets: [
      "Security Triad: Confidentiality (encryption), Integrity (hashes/HMAC), Availability (redundancy/DDoS scrubbing).",
      "Stateless firewalls filter by 5-tuple; Stateful firewalls track connection state; NGFWs perform L7 Deep Packet Inspection.",
      "IDS is out-of-band passive monitoring; IPS is in-line active blocking.",
      "IPsec Tunnel Mode encrypts the entire original IP packet and adds a new outer IP header for Site-to-Site VPNs.",
      "WireGuard uses a clean ~4,000-line codebase with ChaCha20-Poly1305 and Curve25519, avoiding cipher downgrade attacks.",
    ],
    formulaOrCode:
      "IPsec Tunnel Mode: [ New IP Hdr | ESP Hdr | Original IP Hdr | Original Payload | ESP Trailer ]",
  },
];

// =========================================================================
// TOP 10 FREQUENTLY ASKED STAFF-LEVEL COMPUTER NETWORKS INTERVIEW QUESTIONS
// =========================================================================

export const NETWORKS_RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: "cn-rec-1",
    question:
      "Explain in rigorous technical detail what happens when a user types 'https://www.example.com' into a browser and presses Enter (The Complete Packet Journey).",
    difficulty: "Essential",
    topics: ["DNS", "TCP", "TLS", "HTTP", "Full Lifecycle"],
    modelAnswer:
      "1. URL Parsing & HSTS Check: The browser parses protocol, host, and port. It checks the HSTS (HTTP Strict Transport Security) preloaded list to force HTTPS.\n\n2. DNS Resolution: Checks browser cache -> OS cache -> `/etc/hosts` -> Recursive DNS Resolver (via UDP 53). Resolver queries Root, TLD (.com), and Authoritative nameservers to obtain the A/AAAA record (`93.184.216.34`).\n\n3. Routing & ARP: The OS checks its routing table. The destination IP is outside the local subnet, so packets must route to the Default Gateway. The OS checks its ARP cache for the gateway's MAC address; if missing, it broadcasts an ARP Request (`FF:FF:FF:FF:FF:FF`) and receives an ARP Reply.\n\n4. TCP Three-Way Handshake (Port 443): Client sends `[SYN, seq=x]`; Server replies with `[SYN, ACK, seq=y, ack=x+1]`; Client replies with `[ACK, ack=y+1]`. Connection is ESTABLISHED.\n\n5. TLS 1.3 Cryptographic Handshake: Client sends `ClientHello` with supported cipher suites and an ephemeral Diffie-Hellman key share. Server replies with `ServerHello` (its key share), encrypted Certificate, and Finished message. Session keys are derived (1-RTT).\n\n6. HTTP Request & Response: Client transmits encrypted `GET / HTTP/1.1` or HTTP/2 stream frame. Server processes request, generates HTML payload, and returns `HTTP/2 200 OK`.\n\n7. Rendering: Browser parses HTML, builds DOM and CSSOM, discovers linked CSS/JS assets, initiates parallel fetches, runs JavaScript, and renders the webpage.",
    keyTakeaway:
      "Cover every layer: DNS resolution -> ARP gateway resolution -> TCP 3-way handshake -> TLS 1.3 key exchange -> HTTP request/response -> DOM rendering pipeline.",
  },
  {
    id: "cn-rec-2",
    question:
      "Why does TCP use a Three-Way Handshake instead of a Two-Way Handshake to establish a connection? How does SYN Flood attack abuse this and how do SYN Cookies mitigate it?",
    difficulty: "Essential",
    topics: ["TCP", "Handshake", "SYN Flood", "SYN Cookies"],
    modelAnswer:
      "A Two-Way Handshake is insufficient because in an unreliable network, delayed duplicate packets can cause catastrophic ghost connections.\n\nFailure Scenario with 2-Way Handshake:\nSuppose client sends a SYN that gets stuck in a network routing loop. The client times out, sends a new SYN, communicates, and closes. Minutes later, the old delayed SYN finally arrives at the server. Under a 2-way handshake, the server would send SYN-ACK and immediately consider the connection OPEN, allocating buffers and waiting for data that will never arrive.\nWith a 3-way handshake, the server waits for the third ACK. When the client receives an unexpected SYN-ACK for an old dead request, it sends a `RST` (Reset) packet, aborting the half-open connection.\n\nSYN Flood Attack & SYN Cookies:\nAn attacker sends millions of spoofed SYN packets without ever completing the third ACK. The server's SYN queue fills with half-open connections, exhausting kernel memory.\n\nMitigation via SYN Cookies:\nThe server allocates ZERO memory upon receiving a SYN. Instead, it generates an Initial Sequence Number (ISN) containing a cryptographic hash of `{Client IP, Client Port, Server Secret, Timestamp}`. When the legitimate client sends back the final ACK (`ack = ISN + 1`), the server recalculates the hash from the ACK packet. If valid, it allocates the connection buffer on the spot!",
    keyTakeaway:
      "A 3-way handshake prevents duplicate lingering SYNs from creating zombie connections; SYN Cookies encode connection state into the ISN to resist SYN floods without allocating memory.",
  },
  {
    id: "cn-rec-3",
    question:
      "Compare TCP and UDP transport semantics. In what specific engineering scenarios should a software architect choose UDP over TCP?",
    difficulty: "Essential",
    topics: ["TCP vs UDP", "Protocols", "System Design"],
    modelAnswer:
      "1. Structural Differences:\n- TCP is connection-oriented, guarantees ordered and reliable byte-stream delivery, enforces flow control (rwnd) and congestion control (cwnd), but incurs handshake latency (1-RTT) and packet-loss stalling (Head-of-Line blocking). Minimum header: 20 bytes.\n- UDP is connectionless, best-effort (packets can drop, duplicate, or arrive out of order), preserves discrete message boundaries, has zero handshake latency, and imposes no flow/congestion throttling. Fixed header: 8 bytes.\n\n2. When to Choose UDP:\n- Real-Time Media (VoIP, WebRTC, Zoom): A dropped audio/video frame from 150ms ago is completely useless. Retransmitting lost packets via TCP causes audible stutter and buffer bloat.\n- Fast Request-Response Services (DNS, NTP): Incurring a 3-way handshake to query a 40-byte DNS record is pure overhead. UDP finishes the transaction in a single round-trip.\n- Online Multiplayer Gaming: Position updates are broadcast at 60 Hz. Dropped coordinates are superseded by newer coordinates in the next 16ms tick; TCP retransmissions would create unbearable input lag.\n- Custom User-Space Transport Protocols (QUIC / HTTP/3): Implementing modern multiplexing, encryption, and congestion control algorithms in user space without requiring operating system kernel upgrades.",
    keyTakeaway:
      "Choose TCP for correctness, reliability, and ordered file/data transfers; choose UDP for real-time latency sensitivity, simple request-response transactions, or custom transport protocols (QUIC).",
  },
  {
    id: "cn-rec-4",
    question:
      "Explain the four phases of classic TCP Congestion Control (Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery). How does Google BBR differ from loss-based AIMD?",
    difficulty: "Very High",
    topics: ["TCP", "Congestion Control", "AIMD", "BBR"],
    modelAnswer:
      "Classic TCP (Reno) treats packet loss as the sole indicator of network congestion:\n\n1. Slow Start: Starts with `cwnd = 10 MSS`. For every ACK received, `cwnd` increases by 1 MSS (doubles every RTT). Grows exponentially until reaching `ssthresh`.\n2. Congestion Avoidance: Once `cwnd >= ssthresh`, exponential growth stops. `cwnd` increases linearly by 1 MSS per RTT (Additive Increase) to gently probe for available link bandwidth.\n3. Fast Retransmit: If 3 duplicate ACKs are received, TCP deduces a single packet was lost while subsequent packets arrived. It retransmits the missing segment immediately without waiting for the RTO (Retransmission Timeout) timer to expire.\n4. Fast Recovery: Instead of resetting `cwnd` to 1 MSS (Tahoe behavior), Reno sets `ssthresh = cwnd / 2`, sets `cwnd = ssthresh + 3 MSS`, and stays in congestion avoidance (Multiplicative Decrease).\n\nThe Flaw of Loss-Based AIMD and Google BBR:\nClassic TCP keeps increasing its window until it physically overfills intermediate router buffers and causes packet loss (creating massive queuing delays known as Bufferbloat).\nGoogle BBR (Bottleneck Bandwidth and RTT) decouples congestion control from packet loss. It continuously measures two physical properties:\n- Bottleneck Bandwidth (BtlBw): Maximum delivery rate of the link.\n- Round-Trip Propagation Time (RTprop): Minimum latency when queues are empty.\nBBR paces transmissions to keep inflight data equal to `BtlBw * RTprop` (Bandwidth-Delay Product). This achieves maximum throughput with zero queue buildup and minimal latency.",
    keyTakeaway:
      "AIMD ramps up until router buffers overflow; Google BBR measures the physical Bandwidth-Delay Product (BDP) to maximize throughput without filling queues.",
  },
  {
    id: "cn-rec-5",
    question:
      "Given the IP address `192.168.1.130/27`, calculate: Subnet Mask, Network ID, Broadcast ID, First Usable Host IP, Last Usable Host IP, and Total Usable Hosts.",
    difficulty: "Essential",
    topics: ["Subnetting", "CIDR", "IPv4 Math"],
    modelAnswer:
      "Given: IP = `192.168.1.130`, Prefix = `/27`.\n\n1. Host Bits: `32 - 27 = 5 bits`.\n2. Block Size: `2^5 = 32 addresses per subnet`.\n3. Subnet Mask:\n   First 27 bits are 1s, last 5 bits are 0s.\n   Binary: `11111111.11111111.11111111.11100000`.\n   Decimal: `255.255.255.224`.\n\n4. Subnet Boundaries (multiples of 32 in the 4th octet):\n   `0, 32, 64, 96, 128, 160, 192, 224`.\n   The value 130 falls between 128 and 159.\n\n5. Network ID: `192.168.1.128` (all 5 host bits are 0).\n6. Broadcast ID: `192.168.1.159` (all 5 host bits are 1; 128 + 31 = 159).\n7. First Usable Host IP: `192.168.1.129` (Network ID + 1).\n8. Last Usable Host IP: `192.168.1.158` (Broadcast ID - 1).\n9. Total Usable Hosts: `2^5 - 2 = 32 - 2 = 30 usable hosts`.",
    keyTakeaway:
      "Always follow the 4-step sequence: Host_Bits = 32 - Prefix -> Block_Size = 2^Host_Bits -> Find interval bounds -> Subtract Network and Broadcast addresses.",
  },
  {
    id: "cn-rec-6",
    question:
      "How does HTTPS establish secure communications via TLS 1.3? Explain asymmetric key exchange, symmetric session encryption, and Forward Secrecy.",
    difficulty: "High",
    topics: ["HTTPS", "TLS 1.3", "Cryptography", "Security"],
    modelAnswer:
      "HTTPS secures HTTP by running over Transport Layer Security (TLS 1.3), executing a hybrid cryptosystem:\n\n1. The Problem with Asymmetric vs Symmetric Encryption:\n- Asymmetric Encryption (RSA, ECC) is mathematically expensive and slow, but solves key distribution.\n- Symmetric Encryption (AES-GCM, ChaCha20) is ultra-fast, but requires both parties to possess a shared secret key.\n\n2. The TLS 1.3 1-RTT Handshake:\n- Step 1 (ClientHello): Client sends supported cipher suites and an ephemeral Diffie-Hellman key share (`Client_KeyShare`).\n- Step 2 (ServerHello): Server selects cipher, sends its own ephemeral Diffie-Hellman key share (`Server_KeyShare`), and immediately switches to encrypted communication.\n- Both client and server combine the public key shares using Elliptic Curve Diffie-Hellman (ECDHE) to derive identical symmetric session keys (`MasterSecret`).\n- Server sends its digital Certificate (signed by a trusted Certificate Authority) and a cryptographic signature proving ownership of the private key.\n- Client verifies the certificate against root CA public keys embedded in the OS.\n\n3. Forward Secrecy (PFS):\nTLS 1.3 strictly mandates Ephemeral Diffie-Hellman (ECDHE) and prohibits static RSA key exchange. Because key shares are temporary (ephemeral) and discarded after session termination, even if an attacker steals the server's private RSA key in the future, they cannot decrypt previously recorded network traffic.",
    keyTakeaway:
      "TLS 1.3 uses asymmetric ECDHE for a 1-RTT key exchange to establish an ephemeral symmetric AES/ChaCha session key, guaranteeing Forward Secrecy.",
  },
  {
    id: "cn-rec-7",
    question:
      "Explain the architectural distinction between Routing (Control Plane) and Forwarding (Data Plane). How does hardware execute Longest Prefix Match (LPM)?",
    difficulty: "High",
    topics: ["Router Architecture", "LPM", "Control vs Data Plane"],
    modelAnswer:
      "1. Architectural Separation:\n- Control Plane (Routing): The network brain. Implemented in software running on general-purpose CPUs. Executes dynamic routing algorithms (OSPF, BGP, IS-IS) to discover network topology, evaluate policies, and construct the Routing Information Base (RIB).\n- Data Plane (Forwarding): The network muscle. Implemented in specialized hardware (ASICs and Network Processing Units). Forwards incoming packets from input ports to output ports in nanoseconds by consulting the Forwarding Information Base (FIB).\n\n2. Longest Prefix Match (LPM):\nWhen a packet arrives with destination IP `10.1.2.5`, multiple routing entries might match:\n- `10.0.0.0/8`\n- `10.1.0.0/16`\n- `10.1.2.0/24`\nThe router chooses the most specific route: `/24`.\n\n3. Hardware Implementation via TCAM:\nSoftware linear searches or trie traversals cannot sustain 400 Gbps line rates (processing 1 billion packets per second). Routers use Ternary Content Addressable Memory (TCAM):\n- Standard memory takes an address and returns data; CAM takes data and returns the matching address.\n- Ternary CAM supports three bit states: `0`, `1`, and `?` (Don't Care/Wildcard).\n- Subnet masks are loaded into TCAM masks. All hundreds of thousands of prefix routes are evaluated in parallel in a SINGLE clock cycle.",
    keyTakeaway:
      "The Control plane computes global routes in software (RIB); the Data plane forwards packets at line rate using TCAM hardware to execute Longest Prefix Match in a single clock cycle.",
  },
  {
    id: "cn-rec-8",
    question:
      "What is the difference between a Layer 2 Switch and a Layer 3 Router? How does a switch build its CAM table and handle a broadcast storm?",
    difficulty: "Essential",
    topics: ["Switching", "Routing", "CAM Table", "Broadcast Storm"],
    modelAnswer:
      "1. Key Differences:\n- Layer 2 Switch: Operates on Ethernet Frames using 48-bit MAC addresses. Connects devices within the SAME broadcast domain / IP subnet. Forwards traffic at wire speed via hardware ASICs.\n- Layer 3 Router: Operates on IP Packets using 32-bit/128-bit logical IP addresses. Connects DIFFERENT subnets across autonomous networks. Decrements TTL and recalculates checksums.\n\n2. CAM Table (Content Addressable Memory) Learning:\nA switch starts with an empty CAM table:\n- When a frame arrives on Port 3 from `MAC_A` destined for `MAC_B`, the switch inspects the SOURCE MAC: records `MAC_A -> Port 3` with an aging timer.\n- It then looks up DESTINATION `MAC_B`:\n  - If `MAC_B` is known: forwards directly out that port (Unicast).\n  - If `MAC_B` is unknown: floods the frame out all ports except Port 3 (Unknown Unicast Flooding).\n\n3. Broadcast Storm Hazard & STP:\nIf switches are connected with redundant links forming a physical loop, broadcast frames (such as ARP requests or DHCP discovers) are endlessly duplicated and looped by switches.\nBecause Ethernet headers lack a Time-To-Live (TTL) field, broadcast frames circulate infinitely, saturating link bandwidth and causing 100% CPU lockups (Broadcast Storm).\nMitigation: Spanning Tree Protocol (STP / IEEE 802.1D) detects loops and logically disables redundant links into a `BLOCKING` state, unblocking them automatically if an active link fails.",
    keyTakeaway:
      "Switches forward by MAC within a broadcast domain; routers route by IP between broadcast domains. Redundant switch loops create fatal broadcast storms mitigated by STP.",
  },
  {
    id: "cn-rec-9",
    question:
      "How does Network Address Translation (NAT) with Port Address Translation (PAT) allow thousands of private devices to share a single public IP address?",
    difficulty: "High",
    topics: ["NAT", "PAT", "IPv4", "Networking"],
    modelAnswer:
      "1. Motivation:\nIPv4 has only 4.3 billion addresses. Private address spaces (RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) cannot be routed over the public Internet.\n\n2. PAT (NAT Overload) Mechanics:\nPAT multiplexes thousands of private hosts behind a single public IP by tracking 16-bit Layer 4 transport port numbers (up to ~60,000 concurrent sessions):\n- Outbound Request: Internal host `192.168.1.15:52000` sends a TCP SYN to web server `142.250.190.46:443`.\n- Translation: The NAT gateway router intercepts the packet. It replaces the source IP with its own Public IP `203.0.113.1` and replaces the source port with an unused ephemeral port `45100`.\n- State Table: It creates a state entry in its NAT Translation Table:\n  `192.168.1.15:52000 <---> 203.0.113.1:45100 <---> 142.250.190.46:443`.\n- Inbound Response: When the web server replies to `203.0.113.1:45100`, the router searches its NAT table for port `45100`, rewrites destination IP to `192.168.1.15` and destination port to `52000`, and forwards the packet onto the private LAN.\n\n3. Limitations:\nBreaks the end-to-end principle of the Internet. External hosts cannot initiate connections to internal private devices without port forwarding or STUN/TURN traversal.",
    keyTakeaway:
      "PAT maps {Private IP, Private Port} pairs to a single {Public IP, Unique Public Port}, storing mapping state in an internal NAT translation table.",
  },
  {
    id: "cn-rec-10",
    question:
      "Explain how HTTP/3 over QUIC solves the Head-of-Line (HoL) Blocking problem inherent in HTTP/2 over TCP.",
    difficulty: "Very High",
    topics: ["HTTP/3", "QUIC", "HTTP/2", "Head-of-Line Blocking"],
    modelAnswer:
      "1. The Problem in HTTP/1.1 (Application HoL Blocking):\nHTTP/1.1 requires responses to be delivered in the strict serial order of requests over a TCP connection. If request 1 is slow, requests 2 and 3 stall behind it.\n\n2. The Problem in HTTP/2 (Transport HoL Blocking):\nHTTP/2 solved application-level HoL blocking by multiplexing multiple independent request/response streams over a single shared TCP connection.\nHowever, TCP knows nothing about HTTP/2 streams; TCP sees only a single sequential byte stream with strict in-order delivery guarantees.\nWhen a single packet drops on the physical wire:\n- The receiving OS kernel's TCP stack cannot deliver subsequent packets to the application until the missing packet is retransmitted and acknowledged.\n- Even if the dropped packet belonged to Stream 1 (e.g. an image), Streams 2, 3, and 4 (e.g. critical CSS and JavaScript) are completely frozen in the kernel buffer!\n\n3. The Solution in HTTP/3 (QUIC over UDP):\n- HTTP/3 discards TCP and runs over UDP.\n- QUIC implements connection state, reliability, and flow control directly in user space, with native awareness of independent streams.\n- Each QUIC stream has its own independent sequence numbering and receive window.\n- If a packet containing data for Stream 1 drops, ONLY Stream 1 stalls. The kernel and QUIC engine deliver packets for Streams 2, 3, and 4 to the web application without delay!",
    keyTakeaway:
      "HTTP/2 multiplexes streams over one TCP pipe, so a single dropped TCP segment freezes all streams; HTTP/3 embeds stream awareness into QUIC (UDP) so dropped packets affect only the specific stream.",
  },
];

