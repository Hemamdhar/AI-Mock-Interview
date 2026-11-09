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
// DATABASE MANAGEMENT SYSTEMS (DBMS): EXACT PREPLOOM CURRICULUM (6 MODULES, 32 TOPICS)
// =========================================================================

export const DBMS_MODULES: ModuleGroup[] = [
  // ----------------------------------------------------
  // Module 1: DBMS Foundations and Architecture (4 Topics)
  // ----------------------------------------------------
  {
    id: "dbms-mod-1",
    name: "1. DBMS Foundations and Architecture",
    topics: [
      {
        id: "dbms-1-1",
        title: "Introduction to Databases and DBMS",
        moduleName: "1. DBMS Foundations and Architecture",
        readTime: "5 min read",
        summary:
          "A Database Management System (DBMS) is specialized system software designed to store, manage, and query structured data with transactional guarantees, fault tolerance, and access control.",
        theThreeJobs: {
          resourceManager:
            "Storage Engine & Buffer Manager: Organizes physical disk blocks, coordinates buffer pool caches, and minimizes random disk I/O.",
          protectionLayer:
            "Transaction & Concurrency Coordinator: Enforces ACID guarantees, isolation levels, and two-phase locking to prevent corruption.",
          hardwareHelper:
            "Query Optimizer & Execution Engine: Translates declarative SQL queries into optimized relational algebra plans leveraging indexes.",
        },
        keyInvariants: [
          "Data exists independently of the programs that access it (Program-Data Independence).",
          "All modifications are channeled through logging subsystems to guarantee Durability even under power failures.",
          "A database system must preserve data consistency defined by declarative schema constraints and foreign keys.",
        ],
        detailedContent:
          "A database is an organized collection of logically related data, structured to model real-world business domains. A Database Management System (DBMS) sits between user applications and physical hardware storage, exposing declarative query APIs (such as SQL) while managing concurrent access, crash recovery, and index traversal.\n\nCore Responsibilities of a Modern DBMS:\n1. Structured Storage Engine: Arranging relational tuples into fixed-size storage pages (typically 4 KB, 8 KB, or 16 KB) with slotted page headers.\n2. Concurrency Control: Allowing hundreds of concurrent connections to query and update records simultaneously without data corruption.\n3. Crash Recovery: Utilizing Write-Ahead Logging (WAL) to restore committed transactions and roll back in-flight transactions after catastrophic failures.\n4. Declarative Optimization: Parsing high-level SQL declarative intent, transforming it into logical relational plans, evaluating cost metrics, and executing optimized physical plans.",
        diagram: `+-------------------------------------------------------------+
|                  Modern DBMS Engine Architecture            |
+-------------------------------------------------------------+
|  Client Applications (Web / Backend Services / CLI)         |
|                         | (TCP / Wire Protocol)             |
|                         v                                   |
|  [ Connection Manager & Authentication Pool ]               |
|                         |                                   |
|                         v                                   |
|  [ Query Parser & Lexer ] -> Abstract Syntax Tree (AST)     |
|                         |                                   |
|                         v                                   |
|  [ Query Optimizer ] <-> [ Catalog & Statistics Engine ]    |
|  (Cost-Based Optimizer: selects join orders and indexes)    |
|                         |                                   |
|                         v                                   |
|  [ Query Execution Engine ] (Volcano / Vectorized Model)    |
|         |                                    |              |
|         v                                    v              |
|  [ Lock & Concurrency Mgr ]          [ Buffer Pool Mgr ]    |
|  (2PL, MVCC, Latches)                (LRU, Dirty Pages)     |
|         |                                    |              |
|         +-------------------+----------------+              |
|                             |                               |
|                             v                               |
|  [ Storage Engine: Write-Ahead Log (WAL) & Data Pages ]     |
|  (NVMe SSD / Disk Storage: B+ Trees, Heap Files)            |
+-------------------------------------------------------------+`,
        comparisonTable: {
          headers: ["Attribute", "Flat File Storage", "Relational DBMS"],
          rows: [
            ["Data Access", "Application reads whole file or scans offsets", "Declarative SQL with B+ Tree index lookup"],
            ["Concurrency", "File lock locks entire dataset", "Row-level / page-level locking and MVCC"],
            ["Crash Recovery", "Manual backups or corrupted files", "Automated ARIES crash recovery via WAL"],
            ["Integrity", "Enforced manually in application code", "Declarative FK, UNIQUE, CHECK constraints"],
            ["Redundancy", "High duplication across file systems", "Controlled via Normalization (3NF/BCNF)"],
          ],
        },
        interviewWatchout:
          "Avoid defining a DBMS merely as 'software to store tables'. Focus on concurrency control, buffer pool memory management, declarative query optimization, and the Write-Ahead Log (WAL) for durability.",
      },
      {
        id: "dbms-1-2",
        title: "File System vs DBMS",
        moduleName: "1. DBMS Foundations and Architecture",
        readTime: "5 min read",
        summary:
          "Traditional file systems manage unstructured byte streams without transactional guarantees, while DBMS provides schema enforcement, concurrent multi-user consistency, and crash resiliency.",
        keyInvariants: [
          "File systems lack atomicity: a crash during an in-place write leaves half-written bytes on disk.",
          "File systems provide only coarse-grained file locks, preventing simultaneous write access by multiple threads.",
          "DBMS abstracts physical file layout into logical relations, shielding applications from disk sector reorganizations.",
        ],
        detailedContent:
          "In the early era of computing, data was stored in operating system flat files (CSV, TSV, binary structs). While functional for simple utilities, flat file systems break down in multi-user enterprise environments.\n\nCritical Shortcomings of Flat Files:\n1. Data Redundancy and Inconsistency: Duplicate attributes across multiple files cause anomalies when one copy is updated and others remain stale.\n2. Incomplete Transactions: If the operating system halts during a file update, the file is corrupted. File systems do not maintain undo/redo logs.\n3. Lack of Concurrency: When process A opens a file for writing, the OS lock prevents process B from updating a completely independent record in that same file.\n4. Security & Granular Access: Operating systems enforce permissions at the file/directory level. They cannot grant read permission to employee names while hiding their salaries in the same record.\n5. Ad-Hoc Query Inefficiency: Searching for records requires writing procedural scripts that sequentially read every line into memory.",
        interviewWatchout:
          "Interviewers often ask: 'When would you deliberately choose a flat file system over a DBMS?' Valid technical answers: raw append-only distributed event logs (e.g. Kafka partition commit logs), large binary media blobs (S3 object storage), or single-threaded embedded configurations.",
      },
      {
        id: "dbms-1-3",
        title: "Data Models, Schemas, and Instances",
        moduleName: "1. DBMS Foundations and Architecture",
        readTime: "5 min read",
        summary:
          "A Data Model defines the conceptual framework for representing data. The Schema is the structural metadata blueprint, while the Instance is the dynamic operational data at a specific moment.",
        keyInvariants: [
          "Schema (Intension): Static, defined at design time, changes infrequently (DDL operations).",
          "Instance (Extension): Dynamic, set of actual records stored in the database at a specific point in time (DML operations).",
          "The Relational Model organizes all data into mathematical relations (tables) composed of attributes (columns) and tuples (rows).",
        ],
        detailedContent:
          "To design robust information systems, databases distinguish between the structure of data and the actual data content.\n\nData Models Hierarchy:\n- Relational Model: Data is stored in 2D relations (tables). Relations have attributes (columns) with strictly typed domains. Most widely adopted model.\n- Document Model: Data is stored as semi-structured JSON/BSON documents with flexible schemas (e.g., MongoDB).\n- Graph Model: Nodes, edges, and properties representing interconnected network relationships (e.g., Neo4j).\n- Key-Value Model: High-speed hash map abstractions on persistent storage (e.g., Redis, RocksDB).\n\nSchema vs Instance Analogy:\nIn programming languages, a Schema is equivalent to a Type or Class definition (`class Employee { int id; string name; }`), while a Database Instance is equivalent to the set of allocated objects currently residing in memory.",
        codeSnippet: {
          language: "sql",
          code: `-- SCHEMA DEFINITION (Metadata / DDL)
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    salary DECIMAL(10, 2) CHECK (salary > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSTANCE MUTATION (State Change / DML)
-- The schema remains unchanged; the database instance transitions from state T0 to T1
INSERT INTO employees (emp_id, name, department_id, salary)
VALUES (101, 'Ada Lovelace', 1, 95000.00);`,
        },
        interviewWatchout:
          "Distinguish clearly between Schema Evolution (migrations requiring table locks or online DDL algorithms) and Instance Changes (standard DML inserts/updates that execute inside ACID transactions).",
      },
      {
        id: "dbms-1-4",
        title: "Three-Schema Architecture and Data Independence",
        moduleName: "1. DBMS Foundations and Architecture",
        readTime: "6 min read",
        summary:
          "The ANSI/SPARC Three-Schema Architecture separates user views, logical schemas, and physical storage, establishing Logical and Physical Data Independence.",
        keyInvariants: [
          "External Level (User Views): Tailored representations customized for specific user groups or security clearance.",
          "Conceptual Level (Logical Schema): Defines all entities, relationships, constraints, and data types without physical hardware details.",
          "Internal Level (Physical Schema): Dictates how records, indexes, page formats, and file allocations reside on storage media.",
          "Logical Data Independence: Modifying the logical schema does not alter external views or user queries.",
          "Physical Data Independence: Modifying physical indexes, page sizes, or storage devices does not alter the logical schema.",
        ],
        detailedContent:
          "Proposed by the ANSI/SPARC committee in 1975, the Three-Schema Architecture provides an architectural framework to isolate user applications from internal database machinery.\n\nThe Three Layers:\n1. External Schema (Views): Multiple custom views. For example, a customer service representative sees customer contact details, while payroll sees bank account numbers.\n2. Conceptual Schema: The complete logical structure of the entire enterprise database. All tables, primary keys, foreign key constraints, and business invariants are defined here.\n3. Internal Schema: Describes the physical storage layout: byte offsets, record packing, clustering keys, B+ Tree indexes, page compression, and RAID disk configurations.\n\nData Independence Types:\n- Physical Data Independence: You can add an index, switch from HDD to NVMe SSD, or change page size from 8 KB to 16 KB without rewriting any SQL queries or application backend code.\n- Logical Data Independence: You can add a new column or split a table horizontally/vertically without altering existing external views, shielding legacy applications from schema migrations.",
        diagram: `+-------------------------------------------------------------+
|              ANSI/SPARC Three-Schema Architecture           |
+-------------------------------------------------------------+
|  [ View 1 (Payroll) ]       [ View 2 (HR) ]    [ View 3 (Eng) ]
|  (External Level)                                           |
|         ^                          ^                  ^     |
|         +--------------------------+------------------+     |
|                   | Logical Data Independence               |
|                   v                                         |
|  +-------------------------------------------------------+  |
|  |             Conceptual Schema (Logical Level)         |  |
|  |   Tables, Relations, Attributes, Integrity Rules      |  |
|  +-------------------------------------------------------+  |
|                   |                                         |
|                   | Physical Data Independence              |
|                   v                                         |
|  +-------------------------------------------------------+  |
|  |             Internal Schema (Physical Level)          |  |
|  |   B+ Trees, Slotted Pages, Compression, Block Layout  |  |
|  +-------------------------------------------------------+  |
|                   |                                         |
|                   v                                         |
|  [ Physical Persistent Storage: NVMe SSD / Block Storage ]  |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "Explain why Physical Data Independence is easier to achieve in production systems than Logical Data Independence. Adding an index is completely transparent, whereas splitting a relation vertically often requires view rewriting or trigger maintenance.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 2: Relational Model and ER Design (4 Topics)
  // ----------------------------------------------------
  {
    id: "dbms-mod-2",
    name: "2. Relational Model and ER Design",
    topics: [
      {
        id: "dbms-2-1",
        title: "Relational Model Fundamentals",
        moduleName: "2. Relational Model and ER Design",
        readTime: "5 min read",
        summary:
          "Introduced by E.F. Codd in 1970, the Relational Model represents data as mathematical relations (tables) consisting of unordered sets of tuples (rows) with typed attributes.",
        keyInvariants: [
          "A Relation is a mathematical set: duplicate tuples are prohibited by definition.",
          "Tuple order is irrelevant: relations have no intrinsic ordering of rows or columns.",
          "Attribute values must be atomic (First Normal Form requirement): no multi-valued arrays or nested tables.",
        ],
        detailedContent:
          "The relational model revolutionized data processing by grounding database operations in first-order predicate logic and set theory.\n\nFormal Mathematical Definitions:\n- Domain (D): A set of atomic values (e.g., Integer, String, Date).\n- Relation Schema R(A1:D1, A2:D2, ..., An:Dn): Describes relation name R and list of attributes A with their respective domains D.\n- Tuple (t): An ordered list of values <v1, v2, ..., vn> where each vi is an element of Domain(Ai).\n- Relation Instance (r(R)): A mathematical finite subset of the Cartesian product of the domains: r(R) ⊆ D1 × D2 × ... × Dn.\n- Cardinality: The total number of tuples (rows) in the relation.\n- Degree (Arity): The total number of attributes (columns) in the relation schema.",
        comparisonTable: {
          headers: ["Formal Relational Term", "Standard SQL Term", "Informal Analogy"],
          rows: [
            ["Relation", "Table", "Spreadsheet / File"],
            ["Tuple", "Row / Record", "Single Data Entry"],
            ["Attribute", "Column / Field", "Property Header"],
            ["Cardinality", "Row Count", "Number of Records"],
            ["Degree (Arity)", "Column Count", "Number of Fields"],
            ["Domain", "Data Type & Constraints", "Permissible Value Range"],
          ],
        },
        interviewWatchout:
          "Point out the subtle difference between formal relational theory and SQL: Pure relational theory strictly forbids duplicate tuples and maintains no row ordering; standard SQL tables allow duplicates unless a PRIMARY KEY or UNIQUE constraint is defined, and `SELECT *` produces non-deterministic order without an `ORDER BY` clause.",
      },
      {
        id: "dbms-2-2",
        title: "Database Keys",
        moduleName: "2. Relational Model and ER Design",
        readTime: "6 min read",
        summary:
          "Database keys uniquely identify tuples within a relation and establish referential relationships across tables. Understanding Super Keys, Candidate Keys, and Primary Keys is foundational.",
        keyInvariants: [
          "Super Key: Any set of attributes that uniquely identifies a tuple within a relation.",
          "Candidate Key: A minimal super key (no proper subset can uniquely identify a tuple).",
          "Primary Key: The candidate key explicitly chosen by the database architect to uniquely identify tuples.",
          "Alternate Key: Candidate keys not chosen as the primary key.",
          "Foreign Key: An attribute set in one relation referencing a candidate key (usually primary key) of another relation.",
        ],
        detailedContent:
          "Key Hierarchy and Formal Logic:\n\n1. Super Key (SK):\nA set of attributes K is a super key of relation R if no two distinct tuples in any legal relation instance r(R) have identical values for K: t1[K] ≠ t2[K]. A super key may contain extraneous, redundant attributes (e.g., `{SSN, Name}` is a super key if SSN is unique).\n\n2. Candidate Key (CK):\nA candidate key is a minimal super key. That is, K is a candidate key if:\n- Uniqueness: K uniquely identifies every tuple.\n- Irreducibility (Minimality): If any attribute A is removed from K, the remaining subset K - {A} is no longer a super key.\n\n3. Primary Key (PK):\nA database relation can have multiple candidate keys. The database designer selects one as the primary key. Primary key attributes can NEVER contain NULL values (Entity Integrity Constraint).\n\n4. Surrogate Key vs Natural Key:\n- Natural Key: Attributes with real-world business meaning (e.g., National Identity Number, Passport Number).\n- Surrogate Key: Artificial system-generated identifier with no business meaning (e.g., auto-incrementing integer or UUIDv7). Surrogate keys prevent cascading foreign key update storms when business formats change.",
        diagram: `+-------------------------------------------------------------+
|                      Database Keys Hierarchy                |
+-------------------------------------------------------------+
|  +-------------------------------------------------------+  |
|  | SUPER KEYS (All sets that uniquely identify rows)     |  |
|  |   e.g. {ID}, {ID, Name}, {ID, Email}, {SSN, Phone}    |  |
|  |                                                       |  |
|  |   +-----------------------------------------------+   |  |
|  |   | CANDIDATE KEYS (Minimal Super Keys)           |   |  |
|  |   |   e.g. {ID}, {SSN}, {Email}                   |   |  |
|  |   |                                               |   |  |
|  |   |   +-------------------+   +---------------+   |   |  |
|  |   |   | PRIMARY KEY       |   | ALTERNATE     |   |   |  |
|  |   |   |   e.g. {ID}       |   | KEYS          |   |   |  |
|  |   |   | (Chosen for index)|   | e.g. {SSN}    |   |   |  |
|  |   |   +-------------------+   +---------------+   |   |  |
|  |   +-----------------------------------------------+   |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "A classic interview trap: 'Can a candidate key contain more than one attribute?' Yes! That is a Composite Key. A composite key `{student_id, course_id}` is a candidate key as long as neither `student_id` alone nor `course_id` alone uniquely identifies an enrollment.",
      },
      {
        id: "dbms-2-3",
        title: "Integrity Constraints",
        moduleName: "2. Relational Model and ER Design",
        readTime: "5 min read",
        summary:
          "Integrity constraints are declarative rules defined on schemas to guarantee data correctness, validity, and referential consistency during concurrent mutations.",
        keyInvariants: [
          "Domain Integrity: Attribute values must strictly adhere to declared data types, ranges, and nullability rules.",
          "Entity Integrity: Primary key attributes cannot contain NULL values.",
          "Referential Integrity: Foreign key values must either match an existing primary key value in the referenced table or be NULL.",
        ],
        detailedContent:
          "A database without constraints quickly degrades into inconsistent 'garbage in, garbage out' state.\n\nKey Categories of Constraints:\n1. Domain Constraint: Enforces that attribute values come from defined sets. Includes `CHECK (age >= 18)`, `NOT NULL`, and data types.\n2. Entity Integrity Constraint: States that no primary key value can be NULL. Because primary keys serve as unique addresses for individual records, a NULL primary key means an unidentifiable entity.\n3. Referential Integrity Constraint: Governs relationships between tables using Foreign Keys (FK). If Table B has a foreign key referencing Table A's primary key, any value in B's foreign key column MUST exist in Table A.\n\nForeign Key Violation Action Rules:\nWhen a referenced tuple in Table A is updated or deleted:\n- `ON DELETE RESTRICT / NO ACTION`: Rejects the delete operation if child rows exist.\n- `ON DELETE CASCADE`: Automatically deletes all child rows referencing the deleted parent.\n- `ON DELETE SET NULL`: Sets child foreign key values to NULL (requires FK column to be nullable).\n- `ON DELETE SET DEFAULT`: Sets child foreign key values to their default value.",
        codeSnippet: {
          language: "sql",
          code: `CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_total DECIMAL(10, 2) CHECK (order_total >= 0.00), -- Domain Constraint
    order_status VARCHAR(20) CHECK (order_status IN ('PENDING', 'PAID', 'SHIPPED')),
    -- Referential Integrity Constraint with Cascade
    CONSTRAINT fk_customer
        FOREIGN KEY (customer_id) 
        REFERENCES customers(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);`,
        },
        interviewWatchout:
          "Explain why `ON DELETE CASCADE` should be used with extreme caution in high-scale production systems: deleting a single parent customer record could unexpectedly lock and delete millions of historical orders, audit records, and payments, leading to severe lock contention and accidental data loss.",
      },
      {
        id: "dbms-2-4",
        title: "ER Model and Relational Mapping",
        moduleName: "2. Relational Model and ER Design",
        readTime: "6 min read",
        summary:
          "Entity-Relationship (ER) modeling provides a conceptual diagram of real-world entities, attributes, and cardinalities. Mapping rules systematically transform ER diagrams into normalized relational tables.",
        keyInvariants: [
          "Entities map to relational tables; entity attributes map to table columns.",
          "1:1 Relationships are mapped by placing a foreign key on either side (preferably the total participation side).",
          "1:N Relationships are mapped by placing the primary key of the '1' side as a foreign key into the 'N' side table.",
          "M:N Relationships MUST be decomposed into a separate associative junction table containing foreign keys to both entities.",
        ],
        detailedContent:
          "ER Modeling Components:\n- Entity: Real-world object (represented as a Rectangle in Chen notation).\n- Weak Entity: Entity whose existence depends on an owner entity; lacks a full primary key (Double Rectangle; uses a partial discriminator key with dashed underline).\n- Attributes: Properties of entities (Ellipses). Types: Simple, Composite (name -> first, last), Multi-valued (Double Ellipse, e.g., phone numbers), Derived (Dashed Ellipse, e.g., age computed from DOB).\n- Relationships: Associations among entities (Diamonds).\n- Cardinality Ratios: 1:1, 1:N, M:N.\n- Participation: Total participation (every entity instance must participate; double line) vs Partial participation.\n\nRelational Mapping Rules:\n1. Multi-valued Attributes: Multi-valued attributes cannot reside in 1NF tables. They must be extracted into a separate table with `{owner_id, attribute_value}` forming a composite primary key.\n2. M:N Relationships: A Student can enroll in many Courses; a Course has many Students. Mapping requires a junction table: `Enrollments(student_id, course_id, grade)` where `(student_id, course_id)` is a composite primary key.",
        diagram: `+-------------------------------------------------------------+
|                 M:N Relationship Relational Mapping         |
+-------------------------------------------------------------+
|  Conceptual ER Diagram:                                     |
|  [ Student ] <--( M )--- < Enrolls > ---( N )--> [ Course ] |
|                                                             |
|  Relational Schema Transformation (3 Tables):               |
|                                                             |
|  STUDENTS TABLE            ENROLLMENTS (Junction)  COURSES  |
|  +------------+            +--------------------+  +-------+|
|  | student_id |<-----------| student_id (FK)    |  |course_||
|  | name       |            | course_id  (FK)    |->|id (PK)||
|  +------------+            | enrollment_date    |  |title  ||
|                            +--------------------+  +-------+|
|                            PK: (student_id, course_id)      |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "Always mention how to map Weak Entities: A weak entity table must include the primary key of its identifying owner entity as a foreign key, and its own primary key is composite: `{owner_id, partial_discriminator}`.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 3: Relational Algebra and SQL (6 Topics)
  // ----------------------------------------------------
  {
    id: "dbms-mod-3",
    name: "3. Relational Algebra and SQL",
    topics: [
      {
        id: "dbms-3-1",
        title: "Relational Algebra Fundamentals",
        moduleName: "3. Relational Algebra and SQL",
        readTime: "6 min read",
        summary:
          "Relational Algebra is a procedural formal query language. The six fundamental operators (Select, Project, Union, Set Difference, Cartesian Product, Rename) form the theoretical backbone of SQL optimization.",
        keyInvariants: [
          "Selection (σ): Horizontal filtering of tuples that satisfy a predicate; degree unchanged, cardinality <= original.",
          "Projection (π): Vertical filtering of attributes, removing duplicate tuples; degree <= original.",
          "Union (∪) and Set Difference (−) require Union Compatibility (identical arity and compatible attribute domains).",
          "Cartesian Product (×): Combines every tuple of R with every tuple of S; Degree = deg(R) + deg(S), Cardinality = card(R) * card(S).",
        ],
        detailedContent:
          "When you submit a SQL query, the database query planner translates the declarative SQL text into a Relational Algebra expression tree before evaluating query optimization rewrite rules.\n\nFundamental Operators:\n1. Selection (σ_condition(R)): Filters rows where condition is true. Example: `σ_salary > 80000(Employees)`.\n2. Projection (π_attributes(R)): Selects specific columns and discards others. Relational algebra automatically eliminates duplicate rows resulting from projection. Example: `π_name, department_id(Employees)`.\n3. Union (R ∪ S): Combines tuples from two union-compatible relations.\n4. Set Difference (R − S): Retains tuples present in relation R but not in relation S.\n5. Cartesian Product (R × S): Produces all pairwise combinations of tuples.\n6. Rename (ρ_S(R)): Renames relation or attributes to avoid ambiguity.",
        comparisonTable: {
          headers: ["Relational Algebra Operator", "SQL Equivalent", "Operation Type"],
          rows: [
            ["Selection (σ)", "WHERE clause", "Horizontal row filter"],
            ["Projection (π)", "SELECT DISTINCT col1, col2", "Vertical column filter"],
            ["Cartesian Product (×)", "CROSS JOIN / FROM R, S", "Combinatorial combination"],
            ["Union (∪)", "UNION (distinct)", "Set combination"],
            ["Set Difference (−)", "EXCEPT / MINUS", "Set subtraction"],
            ["Intersection (∩)", "INTERSECT (Derived: R − (R − S))", "Set intersection"],
          ],
        },
        interviewWatchout:
          "Remember that in pure relational algebra, Projection (π) ALWAYS eliminates duplicates because a relation is a mathematical set. In SQL, `SELECT` does NOT eliminate duplicates unless you explicitly write `SELECT DISTINCT`.",
      },
      {
        id: "dbms-3-2",
        title: "Joins and Division in Relational Algebra",
        moduleName: "3. Relational Algebra and SQL",
        readTime: "6 min read",
        summary:
          "Join operators combine Cartesian products with selection predicates. The Division operator solves universal quantification queries (e.g., 'find entities related to ALL items').",
        keyInvariants: [
          "Theta Join (⋈_θ): Cartesian Product followed by Selection: R ⋈_θ S = σ_θ(R × S).",
          "Natural Join (⋈): Equi-join on all shared attribute names, projecting out duplicate join columns.",
          "Division Operator (R ÷ S): Used for queries requiring 'for all' conditions; returns tuples in R associated with every tuple in S.",
        ],
        detailedContent:
          "Advanced Relational Algebra Operators:\n\n1. Theta Join (R ⋈_θ S):\nPairs tuples from R and S that satisfy condition θ. If θ uses only equality comparisons (`=`), it is called an Equi-Join.\n\n2. Natural Join (R ⋈ S):\nAutomatically compares attributes having identical names in both relations, equates them, and eliminates redundant duplicate columns in the output relation.\n\n3. Outer Joins (⟕, ⟖, ⟗):\n- Left Outer Join (R ⟕ S): Preserves all tuples from R; unmatched tuples from S are padded with NULL.\n- Right Outer Join (R ⟖ S): Preserves all tuples from S.\n- Full Outer Join (R ⟗ S): Preserves all tuples from both R and S.\n\n4. Relational Division (R ÷ S):\nGiven relation R(A, B) and relation S(B), the division R ÷ S produces all values of A that are paired with EVERY value of B in relation S. Formally: `π_A(R) − π_A((π_A(R) × S) − R)`.\nClassic query: 'Find students who have taken ALL courses required for graduation'.",
        diagram: `+-------------------------------------------------------------+
|             Relational Division (R ÷ S) Visualized          |
+-------------------------------------------------------------+
| Relation R (Completed Courses):    Relation S (Req Courses):|
| Student | Course                   Course                   |
| Alice   | CS101                    CS101                    |
| Alice   | CS102                    CS102                    |
| Bob     | CS101                                             |
| Charlie | CS101                    Division R ÷ S Result:   |
| Charlie | CS102                    Student                  |
| Charlie | CS201                    Alice                    |
|                                    Charlie                  |
| (Bob is excluded because he is missing CS102)               |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "Division is one of the most common GATE and senior technical interview topics. Remember the verbal trigger: whenever an interviewer asks for 'find customers who bought ALL products' or 'suppliers that provide EVERY part', the theoretical answer is Relational Division.",
      },
      {
        id: "dbms-3-3",
        title: "SQL Foundations",
        moduleName: "3. Relational Algebra and SQL",
        readTime: "5 min read",
        summary:
          "SQL (Structured Query Language) is the declarative language for relational databases, categorized into DDL, DML, DCL, and TCL sub-languages.",
        keyInvariants: [
          "DDL (Data Definition Language): CREATE, ALTER, DROP, TRUNCATE (operates on metadata schemas; implicit commit).",
          "DML (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE (operates on table data).",
          "TCL (Transaction Control Language): COMMIT, ROLLBACK, SAVEPOINT (governs transaction boundaries).",
          "DCL (Data Control Language): GRANT, REVOKE (manages security permissions).",
        ],
        detailedContent:
          "SQL Sub-Languages Breakdown:\n\n1. DDL (Schema Operations):\n- `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`.\n- `TRUNCATE TABLE`: Fast DDL operation that deallocates storage extents/pages rather than deleting rows one by one. Resets identity sequences and generates minimal WAL logging compared to `DELETE`.\n\n2. DML (Data Operations):\n- `INSERT INTO ... VALUES ...`\n- `UPDATE ... SET ... WHERE ...`\n- `DELETE FROM ... WHERE ...`: Removes specific tuples row-by-row, recording individual row deletions in the WAL (can be rolled back in a transaction).\n\n3. TCL (Transaction Boundaries):\n- `BEGIN / START TRANSACTION`\n- `COMMIT`: Persists all modifications to the WAL.\n- `ROLLBACK`: Discards modifications using undo log records.\n- `SAVEPOINT point_name`: Establishes an intermediate rollback point within a large transaction.\n\n4. DCL (Security Access):\n- `GRANT SELECT, INSERT ON employees TO app_user;`\n- `REVOKE DELETE ON employees FROM contractor;`",
        comparisonTable: {
          headers: ["Command", "Category", "Can Roll Back?", "Speed", "Fires Triggers?"],
          rows: [
            ["DELETE", "DML", "Yes (logged row by row)", "Slow on large tables", "Yes"],
            ["TRUNCATE", "DDL", "DBMS Dependent (Postgres: Yes, MySQL: No)", "Instant (page deallocation)", "No"],
            ["DROP", "DDL", "DBMS Dependent (Postgres: Yes, MySQL: No)", "Instant (deletes schema & data)", "No"],
          ],
        },
        interviewWatchout:
          "Know the exact differences between `DELETE`, `TRUNCATE`, and `DROP`: `DELETE` removes specific rows with row-level logging and triggers; `TRUNCATE` empties the table by deallocating pages without row triggers; `DROP` destroys the table schema and all data entirely.",
      },
      {
        id: "dbms-3-4",
        title: "SQL Filtering, Sorting, and Aggregation",
        moduleName: "3. Relational Algebra and SQL",
        readTime: "6 min read",
        summary:
          "Mastering SQL execution order is essential: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT. WHERE filters rows before aggregation; HAVING filters groups after aggregation.",
        keyInvariants: [
          "Lexical Order (how you write SQL) differs completely from Logical Execution Order (how the database processes SQL).",
          "WHERE filters individual rows before grouping; aggregate functions (COUNT, SUM, AVG) are ILLEGAL in WHERE clauses.",
          "HAVING filters aggregated groups after GROUP BY; requires aggregate expressions or grouped columns.",
        ],
        detailedContent:
          "Why Execution Order Matters:\nBeginners often write queries that fail compilation because they reference aliases created in the `SELECT` clause within `WHERE` or `GROUP BY` clauses. Understanding logical execution order reveals why this is illegal.\n\nLogical Processing Order:\n1. `FROM` & `JOIN`: Gathers source tables, evaluates join ON conditions, and builds the intermediate cartesian relation.\n2. `WHERE`: Filters base rows prior to any grouping.\n3. `GROUP BY`: Buckets remaining rows into distinct groups based on specified grouping keys.\n4. `HAVING`: Filters aggregated groups based on group predicate conditions.\n5. `SELECT`: Evaluates projection expressions, mathematical operations, and assigns column aliases.\n6. `DISTINCT`: Eliminates duplicate output tuples.\n7. `ORDER BY`: Sorts the final output rows using sort keys or projected aliases.\n8. `LIMIT / OFFSET`: Returns a slice of the sorted stream.",
        codeSnippet: {
          language: "sql",
          code: `-- Finding departments with more than 5 senior engineers making over $100k
SELECT 
    department_id,
    COUNT(emp_id) AS senior_headcount,
    AVG(salary) AS avg_senior_salary
FROM employees
WHERE salary > 100000              -- Step 2: Row-level filter BEFORE grouping
GROUP BY department_id             -- Step 3: Grouping
HAVING COUNT(emp_id) > 5          -- Step 4: Group-level filter AFTER aggregation
ORDER BY avg_senior_salary DESC   -- Step 7: Sort by projected aggregate
LIMIT 10;                         -- Step 8: Top 10 results`,
        },
        interviewWatchout:
          "When asked 'Can we use HAVING without GROUP BY?', answer: YES! If `HAVING` is used without `GROUP BY`, the entire table is treated as a single aggregate group.",
      },
      {
        id: "dbms-3-5",
        title: "SQL Joins, Subqueries, Set Operations, and Views",
        moduleName: "3. Relational Algebra and SQL",
        readTime: "6 min read",
        summary:
          "Advanced SQL combines tables via INNER, LEFT, RIGHT, FULL, and CROSS joins. Correlated subqueries execute per candidate row, while Common Table Expressions (CTEs) and Views improve modularity.",
        keyInvariants: [
          "INNER JOIN: Returns only tuples that have matching keys in both relations.",
          "LEFT OUTER JOIN: Returns all tuples from the left relation, padding missing right attributes with NULL.",
          "Correlated Subquery: A subquery that references columns from the outer query, evaluated once for every outer tuple (potential O(N^2) penalty).",
          "Common Table Expressions (CTEs): Named temporary result sets defined via 'WITH' for readability and recursion.",
        ],
        detailedContent:
          "SQL Joins and Subqueries:\n\n1. Joins:\n- `INNER JOIN`: Intersects matched keys.\n- `LEFT OUTER JOIN`: Keeps all left records.\n- `FULL OUTER JOIN`: Keeps all records from both sides.\n- `CROSS JOIN`: Unconditional Cartesian Product.\n\n2. Subqueries:\n- Scalar Subquery: Returns exactly 1 row and 1 column (can be placed in `SELECT` or comparison expressions).\n- In-List Subquery: Returns 1 column with multiple rows (`WHERE dept_id IN (SELECT ...)`).\n- Correlated Subquery: References outer table columns (`WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id)`). Modern query optimizers decorrelate these into hash joins when possible.\n\n3. Common Table Expressions (WITH clause):\nImproves readability over nested subqueries and enables recursive queries (e.g. organizational chart hierarchies).\n\n4. Database Views:\n- Virtual View: A saved query definition in the data catalog. No data is stored; query is re-executed dynamically on access.\n- Materialized View: Physically stores the query result on disk, periodically refreshed. Essential for analytical reporting.",
        codeSnippet: {
          language: "sql",
          code: `-- CTE for finding employees earning above their department average
WITH DeptAverages AS (
    SELECT department_id, AVG(salary) AS avg_sal
    FROM employees
    GROUP BY department_id
)
SELECT 
    e.emp_id, e.name, e.salary, d.avg_sal
FROM employees e
JOIN DeptAverages d ON e.department_id = d.department_id
WHERE e.salary > d.avg_sal;`,
        },
        interviewWatchout:
          "Explain the difference between `UNION` and `UNION ALL`: `UNION` executes an implicit sorting or hashing deduplication pass to eliminate duplicate rows, which is computationally expensive; `UNION ALL` simply concatenates result sets without deduplication and is much faster.",
      },
      {
        id: "dbms-3-6",
        title: "SQL Query Practice",
        moduleName: "3. Relational Algebra and SQL",
        readTime: "6 min read",
        summary:
          "High-frequency SQL interview problems: finding Nth highest salary, detecting duplicate records, cumulative running totals, and ranking with DENSE_RANK() vs RANK() vs ROW_NUMBER().",
        keyInvariants: [
          "ROW_NUMBER(): Assigns sequential unique integers (1, 2, 3, 4) regardless of ties.",
          "RANK(): Assigns same rank to ties and skips subsequent numbers (1, 2, 2, 4).",
          "DENSE_RANK(): Assigns same rank to ties without skipping subsequent numbers (1, 2, 2, 3).",
        ],
        detailedContent:
          "Staff interviewers regularly evaluate candidate mastery of Window Functions (`OVER (PARTITION BY ... ORDER BY ...)`).\n\nKey Patterns:\n1. Nth Highest Salary without subquery nesting:\nUsing `DENSE_RANK()` partitions salaries correctly even when multiple employees share identical pay.\n2. Finding Duplicate Records:\n`GROUP BY` all candidate key columns with `HAVING COUNT(*) > 1`.\n3. Running Totals (Cumulative Sum):\n`SUM(amount) OVER (PARTITION BY account_id ORDER BY transaction_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`.",
        codeSnippet: {
          language: "sql",
          code: `-- 1. Finding 2nd Highest Salary cleanly
WITH RankedSalaries AS (
    SELECT 
        name,
        salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) AS sal_rank
    FROM employees
)
SELECT name, salary
FROM RankedSalaries
WHERE sal_rank = 2;

-- 2. Deleting duplicate emails while keeping the lowest id
DELETE FROM users
WHERE id NOT IN (
    SELECT MIN(id)
    FROM users
    GROUP BY email
);`,
        },
        interviewWatchout:
          "Always prefer `DENSE_RANK()` over `LIMIT 1 OFFSET (N-1)` for 'Nth highest' questions. If the top 2 employees share the exact same highest salary ($200k), `LIMIT 1 OFFSET 1` will incorrectly return $200k instead of the actual second highest salary ($180k).",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 4: Functional Dependencies and Normalization (6 Topics)
  // ----------------------------------------------------
  {
    id: "dbms-mod-4",
    name: "4. Functional Dependencies and Normalization",
    topics: [
      {
        id: "dbms-4-1",
        title: "Functional Dependencies",
        moduleName: "4. Functional Dependencies and Normalization",
        readTime: "5 min read",
        summary:
          "A Functional Dependency (X -> Y) is a constraint between two attribute sets: if two tuples agree on X, they must agree on Y. Armstrong's Axioms form the complete sound inference rules.",
        keyInvariants: [
          "X -> Y means X uniquely determines Y (Y is functionally dependent on X).",
          "Trivial Dependency: X -> Y is trivial if Y is a subset of X (e.g., {A, B} -> A).",
          "Non-Trivial Dependency: X -> Y where Y is not a subset of X.",
          "Armstrong's Axioms (Reflexivity, Augmentation, Transitivity) are sound (infer only true FDs) and complete (infer all true FDs).",
        ],
        detailedContent:
          "Functional dependencies (FDs) describe business logic constraints in relational schemas.\n\nFormal Definition:\nGiven relation schema R, and attribute subsets X, Y ⊆ R, we say X functionally determines Y (written X -> Y) if for all pairs of tuples t1, t2 in any legal relation instance r(R):\nIf t1[X] = t2[X], then t1[Y] = t2[Y].\n\nArmstrong's Axioms:\n1. Reflexivity: If Y ⊆ X, then X -> Y.\n2. Augmentation: If X -> Y, then XZ -> YZ for any attribute set Z.\n3. Transitivity: If X -> Y and Y -> Z, then X -> Z.\n\nSecondary Derived Rules:\n- Union: If X -> Y and X -> Z, then X -> YZ.\n- Decomposition: If X -> YZ, then X -> Y and X -> Z. (Warning: YZ -> X does NOT imply Y -> X).\n- Pseudo-transitivity: If X -> Y and WY -> Z, then WX -> Z.",
        interviewWatchout:
          "Beware the decomposition trap: If `X -> YZ`, then `X -> Y` and `X -> Z` are true. But if `XY -> Z`, you CANNOT decompose the left-hand side into `X -> Z` or `Y -> Z`!",
      },
      {
        id: "dbms-4-2",
        title: "Attribute Closure and Candidate Keys",
        moduleName: "4. Functional Dependencies and Normalization",
        readTime: "6 min read",
        summary:
          "The Attribute Closure (X+) is the set of all attributes functionally determined by X under a given set of functional dependencies F. It is the core algorithm used to find Candidate Keys.",
        keyInvariants: [
          "Attribute Closure X+: Start with X+ = X; iteratively add Y if W -> Y and W ⊆ X+, until no new attributes can be added.",
          "Super Key Test: If X+ contains ALL attributes of relation R (X+ = R), then X is a Super Key.",
          "Candidate Key Test: If X is a Super Key, and NO proper subset of X is a Super Key, then X is a Candidate Key.",
        ],
        detailedContent:
          "Algorithm for Attribute Closure (X+):\nInput: Attribute set X, Functional Dependencies F.\n1. `result = X`\n2. Repeat until `result` does not change:\n   For each FD `W -> Y` in F:\n     If `W ⊆ result`, then `result = result ∪ Y`\n3. Return `result`.\n\nSystematic Strategy to Find Candidate Keys:\nGiven relation R(A, B, C, D) and FDs F:\n1. Partition attributes into 4 categories:\n   - Left-only (L): Attributes appearing ONLY on the LHS of FDs. (Must be in EVERY candidate key).\n   - Right-only (R): Attributes appearing ONLY on the RHS of FDs. (Can NEVER be part of any candidate key).\n   - Both (B): Attributes appearing on both LHS and RHS.\n   - Neither (N): Attributes appearing in NO FDs. (Must be in EVERY candidate key).\n2. Form initial core set: `Core = L ∪ N`.\n3. Compute `Core+`:\n   - If `Core+ = R`, then `Core` is the ONLY candidate key!\n   - If `Core+ ≠ R`, combine `Core` with attributes from `Both (B)` one by one and test closure.",
        codeSnippet: {
          language: "text",
          code: `Example:
Relation: R(A, B, C, D, E)
FDs: { A -> B, BC -> D, E -> C }

1. Attribute analysis:
   - L (LHS only): { A, E }
   - R (RHS only): { D }
   - B (Both): { B, C }
   - N (Neither): {}

2. Essential core = { A, E }
3. Compute {A, E}+:
   - Initial: { A, E }
   - A -> B applies: { A, B, E }
   - E -> C applies: { A, B, C, E }
   - BC -> D applies: { A, B, C, D, E } = R!

Conclusion: { A, E } is the unique Candidate Key of R!`,
        },
        interviewWatchout:
          "Using the L/R/B/N attribute partitioning technique saves you from testing 2^N powerset combinations in time-pressured coding and systems interviews.",
      },
      {
        id: "dbms-4-3",
        title: "Minimal Cover",
        moduleName: "4. Functional Dependencies and Normalization",
        readTime: "5 min read",
        summary:
          "A Minimal Cover (Canonical Cover) is an equivalent, non-redundant simplified representation of a set of functional dependencies where every RHS is a single attribute and extraneous attributes are removed.",
        keyInvariants: [
          "A Minimal Cover Fc is equivalent to F (Fc+ = F+).",
          "Every FD in Fc has a single attribute on the RHS (Singleton RHS).",
          "No FD in Fc contains extraneous LHS attributes (no redundancy on the left).",
          "No FD in Fc is redundant (removing any FD shrinks the closure).",
        ],
        detailedContent:
          "Three-Step Algorithm to Compute Minimal Cover Fc:\n\nStep 1: Decompose RHS into Single Attributes.\nApply decomposition rule so all dependencies have a single attribute on the right.\nExample: `A -> BC` becomes `A -> B` and `A -> C`.\n\nStep 2: Remove Extraneous LHS Attributes.\nFor each dependency `XY -> A`:\nCheck if X is extraneous: compute `Y+` using all FDs. If `A ∈ Y+`, then X is extraneous and can be removed (leaving `Y -> A`).\nCheck if Y is extraneous: compute `X+`. If `A ∈ X+`, then Y can be removed (leaving `X -> A`).\n\nStep 3: Remove Redundant Functional Dependencies.\nFor each FD `f: X -> A` in F:\nTemporarily remove `f` from F (call it `F' = F - {f}`).\nCompute `X+` using `F'`.\nIf `A ∈ X+`, then `f` was redundant! Delete it permanently from F.",
        interviewWatchout:
          "The order of steps matters: ALWAYS decompose RHS first, then eliminate extraneous LHS attributes, and finally eliminate redundant FDs. Reversing steps 2 and 3 can produce an incorrect non-minimal cover.",
      },
      {
        id: "dbms-4-4",
        title: "Normalization, Anomalies, 1NF, and 2NF",
        moduleName: "4. Functional Dependencies and Normalization",
        readTime: "6 min read",
        summary:
          "Database normalization eliminates update, insertion, and deletion anomalies. 1NF guarantees atomicity of values. 2NF eliminates partial functional dependencies on composite keys.",
        keyInvariants: [
          "Insertion Anomaly: Cannot insert an entity without adding unrelated data (e.g., cannot add a new course without enrolling a student).",
          "Deletion Anomaly: Deleting one entity accidentally destroys unrelated data (e.g., deleting the last student enrolled deletes course info).",
          "Update Anomaly: Updating a single fact requires updating multiple duplicate rows, risking partial updates.",
          "First Normal Form (1NF): All attribute values must be atomic; no multi-valued lists or nested relations.",
          "Second Normal Form (2NF): Relation is in 1NF AND no non-prime attribute is partially dependent on any candidate key.",
        ],
        detailedContent:
          "Normalization Theory:\nNormalization decomposes unnormalized tables into smaller, well-structured relations to eliminate redundancy while preserving information.\n\nPrime vs Non-Prime Attributes:\n- Prime Attribute: An attribute that is a member of ANY candidate key.\n- Non-Prime Attribute: An attribute that does not belong to any candidate key.\n\n1NF (Atomicity):\nA table is in 1NF if every column contains only atomic (indivisible) values and each row is unique. A comma-separated list of phone numbers `555-1234, 555-5678` in a single cell violates 1NF.\n\n2NF (No Partial Dependency):\nA table is in 2NF if it is in 1NF and NO non-prime attribute is functionally dependent on a proper subset of any candidate key.\n- Violation example: Relation `Enrollments(student_id, course_id, student_name, grade)`. Candidate key is `{student_id, course_id}`. `student_name` is non-prime. But `student_id -> student_name` depends on only a PART of the candidate key! This is a partial dependency. To reach 2NF, decompose into: `Students(student_id, student_name)` and `Grades(student_id, course_id, grade)`.",
        interviewWatchout:
          "If a relation's candidate keys all consist of a SINGLE attribute, the relation is AUTOMATICALLY in 2NF! Partial dependencies can only occur when a candidate key is composite.",
      },
      {
        id: "dbms-4-5",
        title: "Third Normal Form and BCNF",
        moduleName: "4. Functional Dependencies and Normalization",
        readTime: "6 min read",
        summary:
          "3NF eliminates transitive dependencies on candidate keys. Boyce-Codd Normal Form (BCNF) is a stricter variant requiring the LHS of every non-trivial FD to be a super key.",
        keyInvariants: [
          "Third Normal Form (3NF): For every non-trivial FD X -> Y, either X is a Super Key OR Y is a Prime Attribute.",
          "Boyce-Codd Normal Form (BCNF): For every non-trivial FD X -> Y, X MUST be a Super Key.",
          "Every relation in BCNF is in 3NF; not every relation in 3NF is in BCNF.",
          "3NF guarantees both Lossless Join AND Dependency Preservation; BCNF guarantees Lossless Join but may NOT preserve dependencies.",
        ],
        detailedContent:
          "3NF (Elimination of Transitive Dependencies):\nIn 3NF, non-prime attributes cannot determine other non-prime attributes (`CK -> X` and `X -> Y`, so `CK -> Y` transitively).\nFormal Rule: For every FD `X -> Y`:\n1. Trivial (`Y ⊆ X`), OR\n2. `X` is a Super Key, OR\n3. `Y` is a Prime Attribute (member of some candidate key).\nCondition 3 is what makes 3NF more lenient than BCNF!\n\nBCNF (Strict Super Key Requirement):\nBCNF removes condition 3. For every non-trivial FD `X -> Y`, `X` MUST be a Super Key, with zero exceptions.\n\nThe Classic 3NF vs BCNF Dilemma:\nConsider relation `Student_Advisor(student_id, subject, advisor)`.\nConstraints:\n- For each student and subject, there is one advisor: `{student_id, subject} -> advisor`.\n- Each advisor advises only one subject: `advisor -> subject`.\nCandidate keys are `{student_id, subject}` and `{student_id, advisor}`.\nCheck `advisor -> subject`:\n- Is `advisor` a super key? No (closure is `{advisor, subject}`).\n- Is `subject` a prime attribute? YES (part of CK `{student_id, subject}`).\nTherefore, the relation IS in 3NF! However, it VIOLATES BCNF because `advisor` is not a super key. If we decompose into BCNF, we lose the dependency `{student_id, subject} -> advisor`.",
        comparisonTable: {
          headers: ["Criterion", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
          rows: [
            ["FD Rule for X -> Y", "X is Super Key OR Y is Prime", "X MUST be a Super Key"],
            ["Redundancy", "Minimal (slight anomaly possible)", "Zero redundancy from FDs"],
            ["Lossless Decomposition", "Always achievable", "Always achievable"],
            ["Dependency Preservation", "ALWAYS guaranteed", "NOT always achievable"],
            ["Industry Standard", "Default for enterprise OLTP", "Used when no FD preservation conflict exists"],
          ],
        },
        interviewWatchout:
          "State clearly why most enterprise production schemas stop at 3NF rather than pushing to BCNF: 3NF guarantees dependency preservation, avoiding expensive multi-table cross-join triggers on updates.",
      },
      {
        id: "dbms-4-6",
        title: "Decomposition and Normalization Practice",
        moduleName: "4. Functional Dependencies and Normalization",
        readTime: "6 min read",
        summary:
          "Decomposing relations requires verifying two mathematical criteria: Lossless Join Property (preserves data without spurious tuples) and Dependency Preservation.",
        keyInvariants: [
          "Lossless Join Decomposition: R1 ⋈ R2 = R. Guaranteed if (R1 ∩ R2) -> (R1 − R2) OR (R1 ∩ R2) -> (R2 − R1).",
          "Lossy Decomposition produces spurious (phantom) tuples that were not present in the original relation.",
          "Dependency Preservation: The union of functional dependencies in decomposed relations covers all original FDs: (F1 ∪ F2)+ = F+.",
        ],
        detailedContent:
          "When decomposing relation R into R1 and R2:\n\n1. Lossless Join Test (Binary Decomposition):\nA decomposition of R into {R1, R2} is lossless if and only if the common attributes contain a candidate key of at least one of the decomposed relations:\n`(R1 ∩ R2) -> R1`  OR  `(R1 ∩ R2) -> R2`.\nIf the intersection does not functionally determine all attributes of either R1 or R2, performing a natural join (`R1 ⋈ R2`) generates fake spurious tuples, permanently corrupting database truth!\n\n2. Dependency Preservation Test:\nProject functional dependencies onto R1 (F1) and R2 (F2). If any original FD in F cannot be verified within individual relations without performing a join across R1 and R2, the decomposition does NOT preserve dependencies.",
        interviewWatchout:
          "Remember the distinction: 'Lossless' refers to preserving data tuples (no phantom rows); 'Dependency Preservation' refers to enforcing business rules without table joins. A decomposition can be lossless without preserving dependencies, and vice versa.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 5: Transactions and Concurrency Control (6 Topics)
  // ----------------------------------------------------
  {
    id: "dbms-mod-5",
    name: "5. Transactions and Concurrency Control",
    topics: [
      {
        id: "dbms-5-1",
        title: "Transactions and ACID Properties",
        moduleName: "5. Transactions and Concurrency Control",
        readTime: "6 min read",
        summary:
          "A transaction is a logical unit of database work. The ACID guarantees (Atomicity, Consistency, Isolation, Durability) ensure reliable execution in the presence of failures and concurrent access.",
        keyInvariants: [
          "Atomicity: All-or-nothing execution; enforced via Undo Logs in the Write-Ahead Log (WAL).",
          "Consistency: Transactions take the database from one valid state satisfying all schema constraints to another.",
          "Isolation: In-flight transactions cannot observe each other's uncommitted intermediate state; enforced via 2PL or MVCC.",
          "Durability: Once committed, updates persist permanently even through sudden power outages; enforced via Redo Logs in WAL.",
        ],
        detailedContent:
          "Transaction States Pipeline:\n1. Active: The transaction is currently executing read/write operations.\n2. Partially Committed: The final statement has executed, but log buffers have not yet flushed to non-volatile disk.\n3. Committed: All log records are flushed to persistent disk (WAL). The transaction is guaranteed durable.\n4. Failed: An error or constraint violation occurred during active or partially committed state.\n5. Aborted: The transaction was rolled back using undo log records. The database state is restored as if the transaction never ran.\n\nMechanisms Powering ACID:\n- A (Atomicity): Undo Logging / Shadow Paging.\n- C (Consistency): Declarative schema constraints, foreign keys, application logic.\n- I (Isolation): Locks (Two-Phase Locking) or timestamps/versioning (MVCC).\n- D (Durability): Force-flush WAL records to disk on commit (fsync).",
        diagram: `+-------------------------------------------------------------+
|                  Transaction Lifecycle State Machine        |
+-------------------------------------------------------------+
|                     +------------+                          |
|                     |   ACTIVE   |                          |
|                     +-----+------+                          |
|                           |                                 |
|            +--------------+--------------+                  |
|            | Normal execution            | Operation error  |
|            v                             v                  |
|  +--------------------+        +--------------------+       |
|  | PARTIALLY COMMITTED|        |       FAILED       |       |
|  +---------+----------+        +---------+----------+       |
|            |                             |                  |
|            | WAL fsync() succeeds        | Undo log rollback|
|            v                             v                  |
|  +--------------------+        +--------------------+       |
|  |     COMMITTED      |        |      ABORTED       |       |
|  |   (State Durable)  |        |  (State Restored)  |       |
|  +--------------------+        +--------------------+       |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "Never confuse Consistency in ACID with Consistency in CAP Theorem. In ACID, Consistency means business and schema constraint integrity (e.g. balance >= 0). In CAP, Consistency means Linearizability (every read receives the most recent write in a distributed system).",
      },
      {
        id: "dbms-5-2",
        title: "Schedules and Serializability",
        moduleName: "5. Transactions and Concurrency Control",
        readTime: "6 min read",
        summary:
          "A schedule is an execution sequence of operations from concurrent transactions. Conflict Serializability guarantees that a concurrent schedule is mathematically equivalent to some serial schedule.",
        keyInvariants: [
          "Two operations conflict if and only if: they belong to different transactions, access the SAME data item, and at least ONE operation is a WRITE.",
          "Conflict Types: Read-Write (RW), Write-Read (WR), Write-Write (WW).",
          "Conflict Serializability is tested by constructing a Precedence Graph (Serialization Graph).",
          "A schedule is Conflict Serializable IF AND ONLY IF its precedence graph contains NO CYCLES.",
        ],
        detailedContent:
          "Serial vs Non-Serial Schedules:\n- Serial Schedule: Transactions execute one strictly after another with no interleaving (T1 finishes entirely, then T2 begins). Always consistent, but suffers from terrible throughput and resource underutilization.\n- Interleaved Schedule: Operations of multiple transactions interleave to maximize CPU and I/O overlap.\n\nConflict Serializability Algorithm (Precedence Graph):\n1. Create a graph node for every active transaction: `T1, T2, ..., Tn`.\n2. Add a directed edge `Ti -> Tj` if an operation in `Ti` executes BEFORE and CONFLICTS with an operation in `Tj`:\n   - `ri(X)` before `wj(X)` (Read-Write conflict)\n   - `wi(X)` before `rj(X)` (Write-Read conflict)\n   - `wi(X)` before `wj(X)` (Write-Write conflict)\n3. Run cycle detection (Topological Sort / DFS):\n   - If graph is a DAG (no directed cycles): The schedule IS Conflict Serializable! Topological sort order gives the equivalent serial schedule.\n   - If graph contains a cycle: The schedule is NOT conflict serializable.",
        interviewWatchout:
          "Be prepared to draw a precedence graph on a whiteboard or scratchpad. Point out that View Serializability is a broader set that includes schedules with blind writes (`wi(X)` without prior read), but view serializability is NP-complete to test, which is why commercial databases enforce conflict serializability.",
      },
      {
        id: "dbms-5-3",
        title: "Recoverability of Schedules",
        moduleName: "5. Transactions and Concurrency Control",
        readTime: "5 min read",
        summary:
          "Concurrency control must prevent dirty reads from producing non-recoverable schedules or cascading abort storms in the event of transaction rollback.",
        keyInvariants: [
          "Recoverable Schedule: If Tj reads data written by Ti, then Ti MUST commit BEFORE Tj commits.",
          "Cascadeless Schedule: Transactions are allowed to read ONLY data items written by already committed transactions (avoids cascading aborts).",
          "Strict Schedule: Transactions can neither read nor write a data item until the transaction that previously wrote it has committed or aborted.",
          "Strict ⊂ Cascadeless ⊂ Recoverable ⊂ All Schedules.",
        ],
        detailedContent:
          "Non-Recoverable Schedule Hazard:\nSuppose T1 writes item X (`w1(X)`). T2 reads that uncommitted value (`r2(X)`), finishes, and COMMITS (`c2`). Later, T1 encounters a division by zero error and ABORTS (`a1`).\nBecause T2's commit was already acknowledged to the user, T2 cannot be rolled back! But T2 read invalid, aborted data from T1. The database is in an irrecoverable state violating Durability.\n\nHierarchy of Safe Schedules:\n1. Recoverable: T2 can read uncommitted X from T1, but T2 must delay its commit until T1 commits. If T1 aborts, T2 must also abort (Cascading Rollback).\n2. Cascadeless (Avoids Cascading Aborts - ACA): T2 cannot read X until T1 commits. Prevents cascading rollbacks completely!\n3. Strict Schedule: T2 cannot read NOR write X until T1 commits or aborts. Easiest for storage recovery engines to manage using simple pre-images.",
        interviewWatchout:
          "State clearly why Cascading Aborts are dangerous in high-concurrency systems: aborting one long-running transaction can force dozens of dependent transactions to abort, creating a storm of CPU and I/O waste.",
      },
      {
        id: "dbms-5-4",
        title: "Concurrency Problems and Locking",
        moduleName: "5. Transactions and Concurrency Control",
        readTime: "6 min read",
        summary:
          "Uncontrolled concurrency produces Dirty Reads, Non-Repeatable Reads, and Lost Updates. Shared (S) and Exclusive (X) locks form the basic synchronization mechanism.",
        keyInvariants: [
          "Dirty Read (Read Uncommitted): Reading data written by an uncommitted, in-flight transaction that may later abort.",
          "Non-Repeatable Read: Re-reading the same row within a transaction returns altered attribute values because another transaction committed an update.",
          "Phantom Read: Re-running a range query within a transaction returns new or missing rows inserted/deleted by another committed transaction.",
          "Lost Update: Two transactions read the same value and write back updates; one write overwrites the other without incorporating its changes.",
        ],
        detailedContent:
          "Standard Lock Modes:\n1. Shared Lock (S): Acquired for read operations. Multiple transactions can hold shared locks on the same data item simultaneously (Read-Read compatibility).\n2. Exclusive Lock (X): Acquired for write operations (`INSERT`, `UPDATE`, `DELETE`). Only one transaction can hold an exclusive lock on an item. No other transaction can hold any lock (S or X) on that item.\n\nLock Compatibility Matrix:\n- Request S while held S: GRANTED.\n- Request S while held X: WAITING.\n- Request X while held S: WAITING.\n- Request X while held X: WAITING.\n\nANSI SQL Isolation Levels & Anomalies Prevented:\n- Read Uncommitted: Susceptible to Dirty Reads, Non-Repeatable Reads, Phantoms.\n- Read Committed: Eliminates Dirty Reads. Susceptible to Non-Repeatable Reads and Phantoms. (Default in PostgreSQL, Oracle, SQL Server).\n- Repeatable Read: Eliminates Dirty Reads and Non-Repeatable Reads. Susceptible to Phantoms. (Default in MySQL InnoDB).\n- Serializable: Eliminates ALL anomalies. Complete isolation.",
        comparisonTable: {
          headers: ["Isolation Level", "Dirty Read", "Non-Repeatable Read", "Phantom Read", "Write Skew"],
          rows: [
            ["Read Uncommitted", "Allowed", "Allowed", "Allowed", "Allowed"],
            ["Read Committed", "Prevented", "Allowed", "Allowed", "Allowed"],
            ["Repeatable Read", "Prevented", "Prevented", "Allowed (MySQL prevents)", "Allowed"],
            ["Serializable", "Prevented", "Prevented", "Prevented", "Prevented"],
          ],
        },
        interviewWatchout:
          "Clarify that MySQL InnoDB's Repeatable Read uses Next-Key Locking (record locks + gap locks) to prevent Phantom Reads even in Repeatable Read mode, going beyond the basic ANSI SQL requirement.",
      },
      {
        id: "dbms-5-5",
        title: "Two-Phase Locking and Deadlocks",
        moduleName: "5. Transactions and Concurrency Control",
        readTime: "6 min read",
        summary:
          "Two-Phase Locking (2PL) guarantees conflict serializability. Strict 2PL and Rigorous 2PL prevent cascading aborts. Deadlocks are resolved via Wait-For Graphs or timestamp preemption.",
        keyInvariants: [
          "2PL Rule: Once a transaction releases any lock, it can NEVER acquire any new lock.",
          "Growing Phase: Locks are acquired; no locks are released.",
          "Shrinking Phase: Locks are released; no locks are acquired.",
          "Strict 2PL: All Exclusive (X) locks must be held until transaction commit/abort (guarantees strict, cascadeless schedules).",
          "Rigorous 2PL: ALL locks (both Shared and Exclusive) are held until transaction commit/abort.",
        ],
        detailedContent:
          "Two-Phase Locking guarantees Conflict Serializability, but it does NOT prevent Deadlocks!\n\nDeadlock Condition:\nTransaction T1 holds lock on A and requests lock on B. Transaction T2 holds lock on B and requests lock on A. Both transactions wait indefinitely.\n\nDeadlock Handling Strategies:\n1. Deadlock Detection (Wait-For Graph):\nThe DBMS builds a directed Wait-For Graph where edges represent `Ti waits for Tj to release lock`. A background thread periodically runs cycle detection. When a cycle is detected, the DBMS picks a 'victim' transaction and aborts it, releasing its locks.\n\n2. Deadlock Prevention (Timestamp Schemes):\nEach transaction receives a monotonically increasing timestamp TS when it starts. Older transactions have smaller timestamps.\n- Wait-Die Scheme (Non-preemptive): If older Ti requests lock held by younger Tj, Ti is allowed to WAIT. If younger Ti requests lock held by older Tj, Ti DIES (aborts and restarts).\n- Wound-Wait Scheme (Preemptive): If older Ti requests lock held by younger Tj, Ti WOUNDS Tj (forces Tj to abort and yield lock). If younger Ti requests lock held by older Tj, Ti WAITS.",
        comparisonTable: {
          headers: ["Scheme", "Older requests Younger", "Younger requests Older", "Starvation Risk"],
          rows: [
            ["Wait-Die", "Older WAITS", "Younger DIES (aborts)", "Possible if repeated aborts"],
            ["Wound-Wait", "Older WOUNDS (aborts younger)", "Younger WAITS", "Minimal (older transactions finish fast)"],
          ],
        },
        interviewWatchout:
          "Remember: Basic 2PL guarantees serializability, but CAN cause cascading aborts if non-strict. Strict 2PL eliminates cascading aborts by holding exclusive locks until commit. Rigorous 2PL holds ALL locks until commit.",
      },
      {
        id: "dbms-5-6",
        title: "Timestamp and Optimistic Concurrency Control",
        moduleName: "5. Transactions and Concurrency Control",
        readTime: "6 min read",
        summary:
          "Alternative non-locking concurrency mechanisms: Thomas Write Rule, Optimistic Concurrency Control (OCC), and Multi-Version Concurrency Control (MVCC) eliminate read locks entirely.",
        keyInvariants: [
          "Timestamp Ordering Protocol: Enforces serialization order according to transaction start timestamps TS(Ti).",
          "Thomas Write Rule: Obsolete out-of-order writes are safely ignored (discarded) rather than aborting the transaction.",
          "Optimistic Concurrency Control (OCC): Read -> Validate -> Write; ideal for low-contention read-heavy workloads.",
          "MVCC (Multi-Version Concurrency Control): Readers never block writers, and writers never block readers.",
        ],
        detailedContent:
          "Locking protocols introduce lock acquisition overhead, lock contention, and deadlock latency. Non-locking mechanisms provide superior throughput for modern multi-core systems.\n\nMulti-Version Concurrency Control (MVCC):\nModern engines (PostgreSQL, MySQL InnoDB, CockroachDB) implement MVCC:\n- Each write creates a new version of the row tuple stamped with the transaction's ID/timestamp (`xmin`, `xmax` in PostgreSQL).\n- When a query executes, it reads the consistent snapshot of tuples valid at the time the query (or transaction) started.\n- Readers never take locks: they simply read old versions from the Undo Log or version store.\n- Writers update rows by writing new versions and acquiring row locks only to prevent concurrent write-write conflicts.\n- Key Result: High-speed concurrent read throughput with zero read-lock overhead!\n\nOptimistic Concurrency Control (OCC):\n1. Read Phase: Read data, perform computations in private local memory workspace.\n2. Validation Phase: Check if any data read was modified by another transaction that committed during execution.\n3. Write Phase: If validation passes, flush local writes to database; if validation fails, abort and restart.",
        interviewWatchout:
          "Staff interviewers love asking: 'How does MVCC handle garbage collection of old row versions?' Explain that PostgreSQL uses the VACUUM process to clean dead row versions (bloat) that are no longer visible to any active transaction snapshot.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 6: Recovery, Indexing, and Query Processing (6 Topics)
  // ----------------------------------------------------
  {
    id: "dbms-mod-6",
    name: "6. Recovery, Indexing, and Query Processing",
    topics: [
      {
        id: "dbms-6-1",
        title: "Storage and File Organization",
        moduleName: "6. Recovery, Indexing, and Query Processing",
        readTime: "5 min read",
        summary:
          "DBMS engines structure physical files into fixed-size storage pages using Slotted Page layouts to support variable-length records and avoid pointer invalidation.",
        keyInvariants: [
          "Data on disk is organized into fixed-size Pages (typically 8 KB or 16 KB); the Page is the unit of transfer between disk and memory.",
          "Slotted Page Architecture: Page header contains an array of slot pointers growing downward; tuple records grow upward from page bottom.",
          "Tuple ID (TID / RID): Composed of Page ID and Slot Index: `(page_number, slot_index)`; remains stable even if tuples are compacted within page.",
        ],
        detailedContent:
          "Hardware I/O operates at block/sector granularity. Storage engines manage physical layout:\n\nSlotted Page Layout:\n- Fixed Header: Page metadata (checksum, free space pointer, LSN).\n- Slot Array: Grows from top down. Each slot contains `(offset, length)` pointing to the actual record location within the page.\n- Tuple Data: Packed from bottom up.\n- Free Space: Resides in the middle between slot array and tuple records.\nWhy this matters: If a variable-length column (VARCHAR) is updated and grows, tuples can be moved within the page and the slot offset updated. The external Tuple ID `(PageId, SlotIndex)` remains unchanged, preventing index pointer invalidation across all secondary B+ Trees!",
        diagram: `+-------------------------------------------------------------+
|                  Slotted Page Architecture (e.g. 8 KB)      |
+-------------------------------------------------------------+
|  PAGE HEADER (LSN, Page ID, Free Space Offset, Slot Count)  |
|  +-------------------------------------------------------+  |
|  | Slot 0: Offset 8100, Len 92  | Slot 1: Offset 7980    |  |
|  | Slot 2: Offset 7850          | Slot Array grows DOWN v|  |
|  +-------------------------------------------------------+  |
|                                                             |
|                   --- FREE SPACE GAP ---                    |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Tuple Records grow UP ^                               |  |
|  | [ Tuple 2 (Offset 7850) ]                             |  |
|  | [ Tuple 1 (Offset 7980) ]                             |  |
|  | [ Tuple 0 (Offset 8100) ]                             |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "Explain why databases do not use direct byte addresses in secondary indexes: Using direct byte addresses means any row relocation would require scanning and updating every single index on the table.",
      },
      {
        id: "dbms-6-2",
        title: "Indexing Fundamentals",
        moduleName: "6. Recovery, Indexing, and Query Processing",
        readTime: "6 min read",
        summary:
          "Indexes are auxiliary data structures that accelerate search queries from O(N) full table scans to O(log N) lookups. Clustered indexes determine physical row order; Secondary indexes store search keys with row pointers.",
        keyInvariants: [
          "Clustered Index: Determines the physical on-disk storage order of table rows; a table can have EXACTLY ONE clustered index.",
          "Secondary (Non-Clustered) Index: Separate structure containing index search keys and pointers (TID or PK) to base data rows.",
          "Dense Index: Contains an index record for EVERY search key in the table.",
          "Sparse Index: Contains index records for only some search keys (requires data to be physically sorted by search key).",
        ],
        detailedContent:
          "Index Classification:\n\n1. Clustered vs Secondary:\n- Clustered Index: In MySQL InnoDB, the Primary Key IS the clustered index. The leaf pages of the B+ Tree contain the actual complete row data tuples! Searching by primary key requires zero secondary lookups.\n- Secondary Index: The leaf pages store the secondary key plus the Primary Key value (in InnoDB) or Tuple ID (in PostgreSQL Heap). Looking up a row via secondary index requires an initial index traversal followed by an extra lookup into the clustered index (called a Bookmark Lookup or Key Lookup).\n\n2. Covering Index Optimization:\nIf a query's `SELECT`, `WHERE`, and `JOIN` clauses reference only columns that are part of the secondary index, the database satisfies the query entirely from index leaf nodes without touching base table heap pages! This is known as an Index-Only Scan.",
        codeSnippet: {
          language: "sql",
          code: `-- Composite Index creation
CREATE INDEX idx_emp_dept_salary ON employees(department_id, salary);

-- COVERING INDEX QUERY:
-- Both department_id and salary exist in the index;
-- Query executes with an Index-Only Scan (0 heap page reads)!
SELECT department_id, salary
FROM employees
WHERE department_id = 10 AND salary > 75000;`,
        },
        interviewWatchout:
          "Remember the Leftmost Prefix Rule for composite indexes: An index on `(A, B, C)` can accelerate queries on `(A)`, `(A, B)`, and `(A, B, C)`. It CANNOT accelerate queries filtering on `(B)` or `(C)` alone!",
      },
      {
        id: "dbms-6-3",
        title: "B-Trees, B+ Trees, and Hashing",
        moduleName: "6. Recovery, Indexing, and Query Processing",
        readTime: "7 min read",
        summary:
          "B+ Trees dominate database indexing because high fanout yields shallow trees (3-4 disk I/Os) and linked leaf nodes allow ultra-fast sequential range scans. Hash indexes provide O(1) point lookups but cannot do range scans.",
        keyInvariants: [
          "B+ Tree Leaf Nodes contain ALL actual keys and pointers, linked sequentially via bidirectional pointers for O(K) range scans.",
          "B+ Tree Internal Nodes store ONLY routing keys and child pointers, maximizing node fanout and minimizing tree depth.",
          "In contrast, standard B-Trees store data pointers in internal nodes, severely reducing fanout and requiring in-order tree traversal for range scans.",
        ],
        detailedContent:
          "Why B+ Trees Beat Binary Search Trees for Disk Storage:\nIn a balanced binary search tree (AVL/Red-Black), each node has 2 children (Fanout = 2). For 100 million records, tree height = log2(100,000,000) ≈ 27 levels. Since every level traversal requires a random disk read (~5-10ms on HDD), searching a single record takes 270ms!\n\nIn a B+ Tree with 8 KB page size and 16-byte keys, each internal node can hold ~500 child pointers (Fanout = 500).\nFor 100 million records:\nHeight = log500(100,000,000) ≈ 3 to 4 levels!\nThe root and upper levels reside cached in memory buffer pools. Finding any record requires at most 1 physical disk I/O!\n\nB+ Tree Structural Properties:\n1. All leaf nodes reside at the exact same depth.\n2. Internal nodes have between ⌈m/2⌉ and m children.\n3. Doubly linked leaf list: Range query `WHERE salary BETWEEN 50000 AND 90000` traverses down to 50000 once in O(log N) time, then scans horizontally along leaf pointers until reaching 90000.",
        diagram: `+-------------------------------------------------------------+
|                      B+ Tree Index Architecture             |
+-------------------------------------------------------------+
|                      [ Root Node: 50 | 100 ]                |
|                           /       |       \\                 |
|                          v        v        v                |
|           [ Node: 20 | 35 ]   [ Node: 75 ]  [ Node: 120 ]   |
|               /     |    \\          ...          ...        |
|              v      v     v                                 |
|  LEAF LEVEL:                                                |
|  +--------------+   +---------------+   +---------------+   |
|  | [10] [20]    |<->| [35] [42]     |<->| [50] [65]     |...|
|  +--------------+   +---------------+   +---------------+   |
|   (Data Rows / TID)  (Data Rows / TID)   (Data Rows / TID)  |
|   <------------------ Sequential Range Scan --------------->|
+-------------------------------------------------------------+`,
        comparisonTable: {
          headers: ["Feature", "B+ Tree Index", "Hash Index"],
          rows: [
            ["Point Lookup (WHERE x = 5)", "O(log m N) (3-4 I/Os)", "O(1) amortized"],
            ["Range Scan (WHERE x > 10)", "Excellent (linked leaf traversal)", "Unsupported (requires full scan)"],
            ["Prefix Matching (LIKE 'abc%')", "Supported", "Unsupported"],
            ["Sorting (ORDER BY)", "Free (retrieved in sorted order)", "Requires manual quicksort/filesort"],
            ["Storage Overhead", "Moderate (rebalancing/fill factor)", "Low (bucket arrays)"],
          ],
        },
        interviewWatchout:
          "Why do databases choose B+ Trees over Hash indexes? Real-world applications constantly run range scans, `ORDER BY`, `GROUP BY`, `MIN()`, and `MAX()`. Hash indexes can only satisfy exact equality (`=`) lookups.",
      },
      {
        id: "dbms-6-4",
        title: "Log-Based Recovery and WAL",
        moduleName: "6. Recovery, Indexing, and Query Processing",
        readTime: "6 min read",
        summary:
          "Write-Ahead Logging (WAL) is the core mechanism of durability: log records describing mutations must be flushed to non-volatile disk before the corresponding dirty data pages are written.",
        keyInvariants: [
          "Write-Ahead Log (WAL) Invariant: Before a dirty data page is written to disk, all log records describing updates to that page MUST be written to disk.",
          "Commit Invariant: A transaction is committed only after its COMMIT log record has been flushed to non-volatile storage.",
          "WAL writes are sequential appends; data page writes are random I/Os. WAL converts slow random disk writes into high-speed sequential writes.",
        ],
        detailedContent:
          "Buffer Pool Management Strategies:\n- Steal vs No-Steal:\n  - Steal: The buffer manager is allowed to flush dirty pages modified by an UNCOMMITTED transaction to disk to free memory. Requires UNDO logging to reverse changes if the transaction aborts!\n  - No-Steal: Dirty pages of uncommitted transactions can never be written to disk. Heavy memory bottleneck.\n- Force vs No-Force:\n  - Force: All pages modified by a transaction must be flushed to disk before commit. Causes massive random I/O write storms at commit time.\n  - No-Force: A transaction commits as soon as its WAL records are flushed; dirty data pages remain in RAM and are lazily written later. Requires REDO logging!\n\nModern High-Performance Engines: STEAL + NO-FORCE.\nBecause engines use Steal + No-Force, both Undo and Redo logging are mandatory in the Write-Ahead Log.",
        interviewWatchout:
          "Explain why high-throughput engines use Steal + No-Force: It delivers maximum memory flexibility and optimal disk throughput by replacing synchronous random page writes with sequential append-only WAL writes.",
      },
      {
        id: "dbms-6-5",
        title: "Checkpoints and Crash Recovery",
        moduleName: "6. Recovery, Indexing, and Query Processing",
        readTime: "6 min read",
        summary:
          "Checkpoints bound crash recovery time by flushing dirty pages and recording clean sync states. The ARIES recovery algorithm operates in three distinct passes: Analysis, Redo, and Undo.",
        keyInvariants: [
          "Without checkpoints, recovery after a crash would require scanning the entire WAL log from the beginning of database history.",
          "Fuzzy Checkpoints write active transaction tables and dirty page tables without pausing concurrent transactions.",
          "ARIES Three Passes: Analysis (reconstructs state), Redo (repeats history to crash point), Undo (rolls back uncommitted transactions).",
        ],
        detailedContent:
          "Checkpoint Types:\n- Sharp (Synchronous) Checkpoint: Stops all transaction processing, flushes all dirty pages to disk, and records checkpoint LSN. Causes major latency spikes.\n- Fuzzy (Non-blocking) Checkpoint: Periodically snapshots the Dirty Page Table (DPT) and Active Transaction Table (ATT) to the log without freezing in-flight transactions.\n\nThe ARIES Recovery Algorithm (Algorithms for Recovery and Isolation Exploiting Semantics):\n\n1. Analysis Pass:\n- Scans the WAL forward from the latest checkpoint record up to the end of the log.\n- Reconstructs the Active Transaction Table (which transactions were running when crash occurred) and the Dirty Page Table (which pages were dirty).\n- Identifies the earliest `RecLSN` (the oldest unwritten dirty page).\n\n2. Redo Pass (Repeating History):\n- Scans the WAL forward starting from the smallest `RecLSN` identified during Analysis.\n- Re-applies all logged actions (both committed and uncommitted transactions!) to bring the database to the exact state it was in at the instant of the crash.\n\n3. Undo Pass:\n- Scans the WAL backward from the crash point.\n- Rolls back changes made by transactions that were active (uncommitted) when the crash occurred.\n- Writes Compensation Log Records (CLRs) so that if another crash occurs during recovery, already undone operations are not undone twice.",
        interviewWatchout:
          "Why does ARIES Redo repeat history for uncommitted transactions that will immediately be undone in the next pass? Repeating history restores the database and internal indexes to a completely consistent physical state before undoing logical operations, drastically simplifying recovery logic.",
      },
      {
        id: "dbms-6-6",
        title: "Query Processing and Optimization",
        moduleName: "6. Recovery, Indexing, and Query Processing",
        readTime: "6 min read",
        summary:
          "Query processing transforms declarative SQL into execution plans: Parsing -> Logical Optimization -> Cost-Based Physical Plan Generation -> Execution Engine (Volcano iterator model).",
        keyInvariants: [
          "Logical Optimization applies algebraic equivalence rewrite rules (Predicate Pushdown, Projection Pushdown).",
          "Cost-Based Optimizer (CBO) uses catalog histograms to estimate disk I/O, CPU cycles, and memory usage for competing physical plans.",
          "Physical Join Algorithms: Nested Loop Join (small datasets), Hash Join (large unsorted equi-joins), Sort-Merge Join (pre-sorted streams).",
        ],
        detailedContent:
          "Query Optimization Lifecycle:\n\n1. Parser & Lexer: Checks SQL syntax and semantics against system catalog, producing an Abstract Syntax Tree (AST).\n\n2. Logical Optimizer (Rule-Based):\n- Predicate Pushdown: Pushes `WHERE` filters down the query tree as close to storage scan nodes as possible, reducing tuple volume before expensive joins.\n- Projection Pushdown: Discards unused columns early to minimize memory footprint.\n\n3. Cost-Based Optimizer (CBO):\nEstimates execution cost: `Cost = (Disk Page Reads * Page Cost) + (Tuples Processed * CPU Cost)`.\nEvaluates join ordering (dynamic programming / genetic algorithms) and access paths (Index Scan vs Full Table Scan).\n\n4. Physical Join Algorithms:\n- Nested Loop Join: For each row in outer table, scan inner table. O(M * N). Fast if outer table is small and inner table has an index lookup O(M * log N).\n- Hash Join: Builds an in-memory hash table on the smaller relation, then streams and probes the larger relation. O(M + N). Best for large ad-hoc equi-joins.\n- Sort-Merge Join: Sorts both relations by join key, then steps through in tandem. O(M log M + N log N). Ideal if inputs are already sorted by clustered indexes.",
        diagram: `+-------------------------------------------------------------+
|             Relational Query Optimization Pipeline          |
+-------------------------------------------------------------+
|  Declarative SQL: SELECT name FROM emp JOIN dept ON ...     |
|                         |                                   |
|                         v                                   |
|  [ Parser & Semantic Analyzer ] -> Syntax Tree              |
|                         |                                   |
|                         v                                   |
|  [ Logical Query Plan ] (Relational Algebra Expression)     |
|    - Predicate Pushdown (Filter early)                      |
|    - Projection Pushdown (Eliminate unused attributes)      |
|                         |                                   |
|                         v                                   |
|  [ Cost-Based Optimizer ] <-> [ Table Statistics / Histograms ]
|    - Evaluates: Index Scan vs Seq Scan                      |
|    - Evaluates: Nested Loop vs Hash Join vs Sort-Merge      |
|                         |                                   |
|                         v                                   |
|  [ Physical Execution Plan ]                                |
|    - Volcano Iterator Model: next() pipeline                |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "Know what 'Predicate Pushdown' is: It is the single most important rule-based optimization. Moving filters below joins reduces intermediate data size by orders of magnitude before joins take place.",
      },
    ],
  },
];

// =========================================================================
// HIGH-YIELD MODULE REVISION SUMMARIES (6 MODULES)
// =========================================================================

export const DBMS_REVISE_SECTIONS: ReviseSection[] = [
  {
    title: "1. Foundations, Architecture & Data Independence",
    summary:
      "Core transition from unstructured file systems to ACID-compliant DBMS engines, the ANSI/SPARC 3-Schema Architecture, and physical vs logical data independence.",
    bullets: [
      "File systems lack atomicity, have coarse locks, and risk data inconsistency; DBMS ensures ACID and schema constraints.",
      "Three-Schema Architecture: External (User Views) -> Conceptual (Logical Schema) -> Internal (Physical B+ Trees / Pages).",
      "Logical Data Independence: Modifying conceptual relations does not alter external application views.",
      "Physical Data Independence: Modifying physical indexes, page sizes, or storage devices does not affect logical schemas.",
      "Buffer Pool Manager manages RAM page caching; Slotted Page layout prevents index pointer invalidation.",
    ],
    formulaOrCode:
      "Data Independence: External Views <--(Logical)--> Conceptual Schema <--(Physical)--> Internal Storage Pages",
  },
  {
    title: "2. Relational Model, Keys & Integrity Constraints",
    summary:
      "Set-theoretic foundations of tables, keys hierarchy, domain/entity/referential constraints, and mapping ER diagrams to normalized tables.",
    bullets: [
      "Relational Model: Relations are mathematical sets of unordered, unique tuples with atomic values (1NF).",
      "Key Hierarchy: Super Key (uniquely identifies) -> Candidate Key (minimal super key) -> Primary Key (selected candidate key).",
      "Entity Integrity requires primary keys to be NOT NULL; Referential Integrity requires valid foreign keys or NULL.",
      "1:N Mapping: Place primary key of '1' side as foreign key into 'N' side table.",
      "M:N Mapping: Must create a separate associative junction table with a composite primary key.",
      "Weak Entity Mapping: Primary key is composite: {owner_id, partial_discriminator}.",
    ],
    formulaOrCode:
      "Candidate Key: K is CK if K+ = R and no proper subset of K has (K - {A})+ = R",
  },
  {
    title: "3. Relational Algebra, SQL Order & Window Functions",
    summary:
      "Procedural relational algebra operators, logical SQL execution order, joins, and window ranking functions.",
    bullets: [
      "Fundamental Operators: Selection (σ), Projection (π), Union (∪), Set Difference (−), Cartesian Product (×), Rename (ρ).",
      "Division (R ÷ S): Expresses universal quantification ('for all' queries).",
      "Logical SQL Execution Order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT.",
      "WHERE filters individual rows before grouping; HAVING filters aggregated groups after GROUP BY.",
      "Ranking Functions: ROW_NUMBER() (strict sequential), RANK() (skips on ties: 1, 2, 2, 4), DENSE_RANK() (no skips: 1, 2, 2, 3).",
      "UNION deduplicates via sorting/hashing; UNION ALL simply appends results at high speed.",
    ],
    formulaOrCode:
      "Execution Order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT",
  },
  {
    title: "4. Functional Dependencies, Normalization & BCNF",
    summary:
      "Armstrong's axioms, attribute closure algorithm, minimal cover, anomalies, and normalization progression from 1NF to BCNF.",
    bullets: [
      "Attribute Closure X+: Iteratively accumulates attributes determined by X until fixed point is reached.",
      "Minimal Cover Fc: Decompose RHS to singletons, remove extraneous LHS attributes, remove redundant FDs.",
      "1NF: Atomic attribute values; 2NF: 1NF + no partial dependency on composite keys.",
      "3NF: For every X -> Y, X is Super Key OR Y is Prime Attribute (preserves dependencies and lossless join).",
      "BCNF: For every X -> Y, X MUST be a Super Key (stricter, may lose functional dependencies).",
      "Lossless Join Criterion: (R1 ∩ R2) -> R1 OR (R1 ∩ R2) -> R2.",
    ],
    formulaOrCode:
      "3NF Rule: X is Super Key OR Y is Prime | BCNF Rule: X MUST be Super Key",
  },
  {
    title: "5. Transactions, ACID, Schedules & 2PL",
    summary:
      "Transaction state pipeline, conflict serializability, schedule recoverability, isolation levels, and locking protocols.",
    bullets: [
      "ACID: Atomicity (Undo Log), Consistency (Constraints), Isolation (2PL/MVCC), Durability (Redo Log in WAL).",
      "Conflict Serializability: Tested via Precedence Graph; serializable IF AND ONLY IF graph has NO directed cycles.",
      "Recoverability: If Tj reads uncommitted data from Ti, Ti must commit before Tj commits to prevent dirty read disasters.",
      "Two-Phase Locking (2PL): Growing phase (acquire locks) -> Shrinking phase (release locks). Guarantees serializability.",
      "Strict 2PL holds exclusive locks until commit; Rigorous 2PL holds all locks until commit (prevents cascading aborts).",
      "MVCC: Readers read old snapshot versions without taking locks; writers modify new versions without blocking readers.",
    ],
    formulaOrCode:
      "Precedence Graph: Directed edge Ti -> Tj for conflicting operations where Ti executes before Tj",
  },
  {
    title: "6. Storage, B+ Trees, WAL & ARIES Recovery",
    summary:
      "Slotted page layout, clustered vs secondary indexing, B+ Tree fanout, Write-Ahead Logging, and ARIES recovery passes.",
    bullets: [
      "Slotted Page: Page header with slot pointer array growing down, records growing up, absorbing variable-length updates.",
      "Clustered Index determines physical row layout (leaf = data row); Secondary Index stores search key + PK pointer.",
      "B+ Tree: High fanout yields shallow 3-4 level trees; linked leaf nodes enable high-speed sequential range scans.",
      "Write-Ahead Logging: Log records MUST be flushed to disk before dirty data pages are flushed (Steal + No-Force).",
      "ARIES Crash Recovery: Analysis Pass (rebuilds ATT/DPT) -> Redo Pass (repeats history) -> Undo Pass (rolls back active transactions).",
      "Query Optimization: Predicate pushdown moves filters below joins to reduce intermediate tuple sizes early.",
    ],
    formulaOrCode:
      "B+ Tree Fanout: Height = log_fanout(N); Typical height 3-4 covers 100M+ rows with 1 disk I/O",
  },
];

// =========================================================================
// TOP 10 FREQUENTLY ASKED STAFF-LEVEL DBMS INTERVIEW QUESTIONS (RECALL MODE)
// =========================================================================

export const DBMS_RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: "dbms-rec-1",
    question:
      "Explain the difference between Conflict Serializability and View Serializability. How does Precedence Graph cycle detection guarantee conflict serializability?",
    difficulty: "Essential",
    topics: ["Serializability", "Concurrency", "Transactions"],
    modelAnswer:
      "A schedule is Conflict Serializable if it can be transformed into a serial schedule by swapping non-conflicting adjacent operations.\nTwo operations conflict if they belong to different transactions, access the same data item, and at least one is a write (RW, WR, WW).\n\nPrecedence Graph (Serialization Graph):\n- Construct a directed graph with a node for each transaction.\n- Add edge Ti -> Tj if Ti executes an operation that conflicts with and precedes an operation in Tj.\n- If the graph has NO cycles, topological sorting yields the equivalent serial schedule.\n\nView Serializability is a weaker, broader condition: a schedule is View Serializable if it is view equivalent to some serial schedule (same initial reads, same read-from dependencies, same final writes).\nAll conflict serializable schedules are view serializable, but some view serializable schedules with 'blind writes' (write without read) are not conflict serializable.\nTesting view serializability is NP-Complete, which is why commercial database engines enforce conflict serializability.",
    keyTakeaway:
      "Conflict serializability is polynomial-time verifiable via cycle detection on a Precedence Graph; View serializability allows blind writes but is NP-Complete.",
  },
  {
    id: "dbms-rec-2",
    question:
      "Why do major relational databases (MySQL InnoDB, PostgreSQL, Oracle) use B+ Trees instead of B-Trees or Binary Search Trees for table indexing?",
    difficulty: "Essential",
    topics: ["B+ Tree", "Indexing", "Storage Engine"],
    modelAnswer:
      "Database engines favor B+ Trees over B-Trees and BSTs for three fundamental physical storage reasons:\n\n1. Massive Fanout and Shallow Tree Depth: A Binary Search Tree has fanout = 2, requiring ~27 random disk seeks to find a row among 100M records. A B+ Tree page (8 KB or 16 KB) holds hundreds of keys, giving a fanout of 500-1000. Tree height is capped at 3-4 levels, requiring only 1 random disk read (since root and upper levels reside in RAM buffer pools).\n\n2. Higher Node Capacity in Internal Nodes: In a standard B-Tree, internal nodes store both keys and actual row data/pointers. In a B+ Tree, internal nodes store ONLY search keys and child page pointers. This allows internal nodes to fit 2-3x more routing pointers per 8 KB page, maximizing fanout and keeping the tree shorter.\n\n3. High-Speed Range Scans: In a standard B-Tree, range queries (`WHERE age BETWEEN 20 AND 30`) require traversing up and down the tree using in-order traversal. In a B+ Tree, all leaf nodes are linked into a continuous doubly-linked list. The engine seeks to the start key once in O(log N) time and scans horizontally across leaf pages sequentially.",
    keyTakeaway:
      "B+ Trees maximize fanout by keeping internal nodes lean and connect all leaf nodes into a doubly-linked list for sequential range scans.",
  },
  {
    id: "dbms-rec-3",
    question:
      "Explain the ANSI SQL isolation levels and describe the specific concurrency anomalies (Dirty Read, Non-Repeatable Read, Phantom Read) each level eliminates.",
    difficulty: "Essential",
    topics: ["Isolation Levels", "ACID", "Transactions"],
    modelAnswer:
      "The four ANSI SQL isolation levels represent tradeoffs between concurrency throughput and strict consistency:\n\n1. Read Uncommitted: Transactions read data modified by other in-flight transactions. Suffers from Dirty Reads (reading uncommitted data that may later be aborted/rolled back).\n\n2. Read Committed: Guarantees transactions only read data that has been committed. Eliminates Dirty Reads. Suffers from Non-Repeatable Reads (re-reading the same row within a transaction returns altered column values because another transaction committed an update).\n\n3. Repeatable Read: Guarantees that any row read once will return the exact same values throughout the transaction. Eliminates Dirty Reads and Non-Repeatable Reads. Suffers from Phantom Reads (re-running a range query returns new rows inserted or deleted by another committed transaction).\n\n4. Serializable: Complete isolation. Eliminates Dirty Reads, Non-Repeatable Reads, Phantom Reads, and serialization anomalies (e.g. write skew). Equivalent to strictly serial execution.",
    keyTakeaway:
      "Read Committed eliminates Dirty Reads; Repeatable Read eliminates Non-Repeatable Reads; Serializable eliminates Phantom Reads and Write Skew.",
  },
  {
    id: "dbms-rec-4",
    question:
      "What is Write-Ahead Logging (WAL) and how does the ARIES recovery algorithm use Analysis, Redo, and Undo passes to recover from an abrupt crash?",
    difficulty: "Very High",
    topics: ["WAL", "Crash Recovery", "ARIES"],
    modelAnswer:
      "Write-Ahead Logging (WAL) mandates that all log records describing modifications must be flushed to non-volatile disk before the corresponding dirty data pages are flushed to disk. This allows using a high-performance Steal + No-Force buffer pool policy.\n\nThe ARIES (Algorithms for Recovery and Isolation Exploiting Semantics) algorithm executes in three sequential passes after a crash:\n\n1. Analysis Pass: Scans WAL forward from the most recent checkpoint. It reconstructs the system state at crash time: which transactions were active (Active Transaction Table - ATT) and which buffer pages were dirty (Dirty Page Table - DPT). It determines the earliest log sequence number (RecLSN) where dirty data had not yet been written to disk.\n\n2. Redo Pass ('Repeating History'): Scans forward from the smallest RecLSN. It re-applies all logged changes (for BOTH committed and uncommitted transactions) to restore the physical database to the exact state it was in at the instant of the crash.\n\n3. Undo Pass: Scans backward from the crash point. It rolls back operations performed by active transactions that never committed before the crash. For each undone operation, it writes a Compensation Log Record (CLR) to prevent repeating undo work if another crash occurs during recovery.",
    keyTakeaway:
      "WAL guarantees durability by logging before writing; ARIES reconstructs state (Analysis), repeats history (Redo), and rolls back active transactions (Undo).",
  },
  {
    id: "dbms-rec-5",
    question:
      "What is the difference between 3NF and BCNF? Provide an example of a relation that satisfies 3NF but violates BCNF.",
    difficulty: "High",
    topics: ["Normalization", "3NF", "BCNF"],
    modelAnswer:
      "Both normal forms eliminate transitive functional dependencies, but differ in their allowance for prime attributes:\n\n- Third Normal Form (3NF): For every non-trivial functional dependency X -> Y, EITHER X is a Super Key OR Y is a Prime Attribute (part of some candidate key).\n- Boyce-Codd Normal Form (BCNF): For every non-trivial functional dependency X -> Y, X MUST be a Super Key (no exceptions for prime attributes).\n\nExample satisfying 3NF but violating BCNF:\nRelation: `Student_Counselor(student_id, major, counselor)`\nDependencies:\n1. `{student_id, major} -> counselor` (Each student has one counselor per major)\n2. `counselor -> major` (Each counselor specializes in only one major)\n\nCandidate Keys: `{student_id, major}` and `{student_id, counselor}`.\nPrime attributes: `student_id`, `major`, `counselor`.\n\nCheck `counselor -> major`:\n- Is `counselor` a super key? No.\n- Is `major` a prime attribute? YES (part of candidate key `{student_id, major}`).\nBecause `major` is prime, the relation satisfies 3NF!\nHowever, because `counselor` is NOT a super key, it violates BCNF. Decomposing to BCNF would require splitting into `{counselor, major}` and `{student_id, counselor}`, which loses the dependency `{student_id, major} -> counselor`.",
    keyTakeaway:
      "3NF allows X -> Y if Y is prime, preserving dependencies; BCNF strictly demands X be a super key, which can cause dependency loss.",
  },
  {
    id: "dbms-rec-6",
    question:
      "How does Multi-Version Concurrency Control (MVCC) eliminate read-write contention in database engines like PostgreSQL and MySQL InnoDB?",
    difficulty: "Very High",
    topics: ["MVCC", "Concurrency", "Locking"],
    modelAnswer:
      "In traditional locking systems (2PL), shared read locks block exclusive write locks, and write locks block read locks. Under high traffic, read queries stall background writes and writes block readers.\n\nMVCC resolves this by decoupling reads from writes using row versioning:\n- Snapshot Isolation: When a transaction or statement starts, the engine assigns it a Read View (snapshot timestamp). The transaction sees only data committed before its snapshot timestamp.\n- Non-Blocking Reads: When a query reads a row being modified by a concurrent writer, it does not wait for locks. Instead, it reads the previous committed version of the row from the Undo Log (MySQL InnoDB) or dead tuple storage (PostgreSQL).\n- Writers: When a transaction updates a row, it creates a new version with its transaction ID (`xmin`/`xmax`) and locks only the specific row to prevent concurrent write-write conflicts.\n- Key Result: 'Readers never block writers, and writers never block readers.'",
    keyTakeaway:
      "MVCC serves reads from historical snapshots in the undo log, allowing concurrent reads and writes to proceed without lock contention.",
  },
  {
    id: "dbms-rec-7",
    question:
      "Explain the Two-Phase Locking (2PL) protocol. What is the difference between Strict 2PL and Rigorous 2PL, and how do they prevent cascading aborts?",
    difficulty: "High",
    topics: ["2PL", "Locking", "Cascading Aborts"],
    modelAnswer:
      "Two-Phase Locking (2PL) is a concurrency control protocol that guarantees conflict serializability.\nRule: A transaction cannot acquire any new lock once it releases a lock.\n- Growing Phase: Locks are acquired; no locks are released.\n- Shrinking Phase: Locks are released; no locks can be acquired.\n\nBasic 2PL allows releasing locks before commit. This causes Cascading Aborts: If T1 modifies item X, releases its lock, T2 reads X, and T1 subsequently aborts, T2 must also be aborted.\n\nStrict 2PL:\nAll EXCLUSIVE (X) locks acquired by a transaction must be held until the transaction COMMITS or ABORTS. Shared (S) locks can be released during the shrinking phase. This ensures that no other transaction can read uncommitted dirty data, completely preventing cascading aborts!\n\nRigorous 2PL:\nALL locks (both Shared and Exclusive) must be held until transaction commit or abort. Shrinking phase occurs in a single instant at commit time. Guarantees that the serialization order is identical to commit order.",
    keyTakeaway:
      "Basic 2PL guarantees serializability; Strict 2PL holds exclusive locks until commit to prevent cascading aborts; Rigorous 2PL holds all locks until commit.",
  },
  {
    id: "dbms-rec-8",
    question:
      "What is the difference between a Clustered Index and a Non-Clustered (Secondary) Index? How does this impact write amplification and index lookups?",
    difficulty: "Essential",
    topics: ["Clustered Index", "Secondary Index", "B+ Tree"],
    modelAnswer:
      "1. Clustered Index:\n- Defines the physical, on-disk storage order of rows in the table.\n- A table can have EXACTLY ONE clustered index because data rows can only be physically sorted one way.\n- The leaf nodes of the clustered B+ Tree contain the actual complete row data (e.g. in MySQL InnoDB, the Primary Key is the clustered index).\n- Primary key lookups require zero secondary seeks: finding the leaf node gives the entire tuple immediately.\n\n2. Non-Clustered (Secondary) Index:\n- A completely separate B+ Tree auxiliary structure.\n- The leaf nodes store the indexed column(s) plus a row locator pointer: in PostgreSQL, a Tuple ID (Page ID + Slot); in MySQL InnoDB, the table's Primary Key value.\n- Secondary lookups require a two-step traversal: search secondary B+ Tree -> obtain row locator -> traverse clustered B+ Tree (Bookmark Lookup).\n\nWrite Amplification Impact:\nWhen an `INSERT` or `DELETE` occurs, every secondary index must be updated with a new leaf entry. Secondary indexes on auto-incrementing surrogate keys cause high write overhead if multiple secondary indexes exist.",
    keyTakeaway:
      "Clustered index leaf nodes store actual table rows; secondary index leaf nodes store index keys and pointers to the clustered key/TID.",
  },
  {
    id: "dbms-rec-9",
    question:
      "Explain the Phantom Read anomaly and why standard row-level locks fail to prevent it without Gap Locks or Next-Key Locking.",
    difficulty: "High",
    topics: ["Phantom Read", "Gap Locking", "InnoDB"],
    modelAnswer:
      "A Phantom Read occurs when transaction T1 executes a range query (`SELECT * FROM orders WHERE total > 100`), and transaction T2 concurrently inserts a new order with `total = 150` and commits. When T1 re-runs the range query, a 'phantom' new row appears that was not present previously.\n\nWhy standard row locks fail:\nRow-level locks can only be placed on records that ALREADY EXIST in the database. When T1 executes its query, it locks existing rows where `total > 100`. The new row that T2 wants to insert does not physically exist yet! Therefore, T2 encounters no row lock and successfully inserts the record.\n\nHow Next-Key Locking solves it:\nMySQL InnoDB solves phantom reads in Repeatable Read mode using Next-Key Locking (a combination of a Record Lock and a Gap Lock):\n- Record Lock: Locks the index record itself.\n- Gap Lock: Locks the empty space (gap) between index records and before/after the first and last keys.\nWhen T1 scans the range, it places gap locks over all gaps in the range. When T2 attempts to insert a row into a locked gap, it is blocked until T1 commits.",
    keyTakeaway:
      "Row locks cannot lock rows that do not exist yet; Gap Locks lock the empty index intervals between rows to block concurrent inserts.",
  },
  {
    id: "dbms-rec-10",
    question:
      "Compare the physical execution mechanics of Nested Loop Join, Hash Join, and Sort-Merge Join. When does the query optimizer select each?",
    difficulty: "Very High",
    topics: ["Query Optimizer", "Joins", "Execution Engine"],
    modelAnswer:
      "Relational database query engines implement three primary physical join algorithms:\n\n1. Nested Loop Join:\n- Mechanics: For each outer tuple, scan the inner table. If the inner table has an index on the join key (Index Nested Loop), it performs an index seek per outer row.\n- Complexity: O(M * N) without index; O(M * log N) with index.\n- Optimizer Choice: Selected when the outer relation is small and the inner relation has a high-selectivity index.\n\n2. Hash Join:\n- Mechanics: Two-phase algorithm. Build Phase: reads the smaller relation and constructs an in-memory hash table on the join key. Probe Phase: streams the larger relation, hashes its join key, and probes the hash table for matches.\n- Complexity: O(M + N) linear time.\n- Optimizer Choice: Selected for large, unsorted datasets with equality join predicates (`ON a.id = b.id`) where relations fit in working memory (work_mem / buffer pool).\n\n3. Sort-Merge Join:\n- Mechanics: Sorts both relations by the join key (if not already sorted by an index), then advances two pointers simultaneously through both sorted streams in tandem.\n- Complexity: O(M log M + N log N) for sorting, plus O(M + N) for the merge.\n- Optimizer Choice: Selected when inputs are already sorted (e.g. by a clustered index or range scan) or when join predicates involve inequalities (`<`, `<=`).",
    keyTakeaway:
      "Nested Loop is best for small outer + indexed inner; Hash Join is best for large unsorted equality joins; Sort-Merge is best for pre-sorted streams and inequality joins.",
  },
];

