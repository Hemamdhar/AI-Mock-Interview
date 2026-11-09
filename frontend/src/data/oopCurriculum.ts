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
// OBJECT-ORIENTED PROGRAMMING: EXACT PREPLOOM CURRICULUM (6 MODULES, 23 TOPICS)
// =========================================================================

export const OOP_MODULES: ModuleGroup[] = [
  // ----------------------------------------------------
  // Module 1: OOP Foundations (4 Topics)
  // ----------------------------------------------------
  {
    id: "oop-mod-1",
    name: "1. OOP Foundations",
    topics: [
      {
        id: "oop-1-1",
        title: "Introduction to Object-Oriented Programming",
        moduleName: "1. OOP Foundations",
        readTime: "5 min read",
        summary:
          "Object-Oriented Programming organizes software design around data entities (objects) rather than functions and logic. It binds state and behavior into cohesive units to manage complexity at scale.",
        theThreeJobs: {
          resourceManager:
            "State & Data Hiding: Encapsulates mutable variables within private boundaries to protect invariant integrity.",
          protectionLayer:
            "Behavioral Abstraction: Exposes clean interfaces and polymorphic contracts while concealing implementation mechanics.",
          hardwareHelper:
            "Modular Composition: Enables scalable system architectures by assembling loosely coupled, highly cohesive objects.",
        },
        keyInvariants: [
          "Procedural programming treats data and functions as separate entities; OOP couples them into cohesive objects.",
          "An object represents an entity with clear state (fields), behavior (methods), and distinct runtime identity.",
          "Modularity ensures changes inside an object's implementation do not ripple across external consumers.",
        ],
        detailedContent:
          "In procedural languages such as C, data structures (structs) are decoupled from the procedures that manipulate them. Any function with access to a struct pointer can mutate its internal fields, making it difficult to enforce invariants as codebases scale to millions of lines.\n\nObject-Oriented Programming (OOP) addresses this fragility by combining state and behavior into an encapsulated unit: the Class. By controlling access to state through methods, a class guarantees that its data remains valid at all times.\n\nCore Goals of OOP:\n1. Modularity: Complex systems are decomposed into autonomous entities that interact through well-defined protocols.\n2. Reusability: Generic behaviors and components can be shared via composition, interfaces, and inheritance without duplicating code.\n3. Extensibility: New functionality can be added with minimal modification to existing code through polymorphism.\n4. Maintainability: Localized bug fixing and refactoring because internal data structures are hidden behind public interfaces.",
        diagram: `+-------------------------------------------------------------+
|                 Procedural vs Object-Oriented               |
+-------------------------------------------------------------+
| Procedural Model (Separated):                               |
|   [ Global/Shared Data ] <---> [ Function A ]                |
|           ^                <---> [ Function B ]             |
|           +----------------<---> [ Function C ]             |
|   (Unrestricted mutations, difficult to maintain invariants)|
|                                                             |
| Object-Oriented Model (Encapsulated):                       |
|   +-------------------------------------------------------+ |
|   | Object Boundary                                       | |
|   |   +-------------------+                               | |
|   |   | Private State     |                               | |
|   |   | (Fields / Data)   |                               | |
|   |   +---------^---------+                               | |
|   |             | (Controlled Access)                     | |
|   |   +---------v---------+                               | |
|   |   | Public Interface  |<--- External Method Call      | |
|   |   | (Methods/Behavior)|                               | |
|   |   +-------------------+                               | |
|   +-------------------------------------------------------+ |
+-------------------------------------------------------------+`,
        comparisonTable: {
          headers: ["Criterion", "Procedural Programming", "Object-Oriented Programming"],
          rows: [
            ["Primary Focus", "Algorithm & Sequence of Operations", "Data Entities & Behavioral Contracts"],
            ["Data Security", "Low (Data exposed to all functions)", "High (Data hidden behind access modifiers)"],
            ["Design Approach", "Top-Down Decomposition", "Bottom-Up Modeling"],
            ["State Handling", "Shared structs, global variables", "Encapsulated instance fields"],
            ["Extensibility", "Requires modifying existing functions", "Extend via new classes and polymorphism"],
          ],
        },
        interviewWatchout:
          "Interviewers often ask why OOP is preferred over procedural programming for large applications. Focus your answer on invariant enforcement, data hiding, and decoupling rather than generic answers like 'code reuse'.",
      },
      {
        id: "oop-1-2",
        title: "Classes and Objects",
        moduleName: "1. OOP Foundations",
        readTime: "6 min read",
        summary:
          "A Class is a user-defined blueprint describing state and behavior, while an Object is a concrete runtime instance allocated in memory with distinct identity.",
        keyInvariants: [
          "A Class declaration allocates no heap memory for instance state; memory is allocated when an object is instantiated via 'new'.",
          "Every object has three fundamental characteristics: State (values of fields), Behavior (methods), and Identity (memory reference).",
          "Two distinct objects can have identical state while possessing different identities.",
        ],
        detailedContent:
          "A Class serves as a compile-time type specification. It defines the layout of fields, method definitions, access permissions, and constructor signatures. It resides in the Metaspace/Class metadata memory region.\n\nAn Object is a concrete instance constructed at runtime in the managed heap. When you instantiate a class (e.g., in Java or C# with the 'new' keyword):\n1. Heap allocation: Space is reserved in the heap for object headers (mark word, type pointer/vptr) and instance fields.\n2. Initialization: Fields are zeroed, explicit initializers run, and the constructor executes.\n3. Reference assignment: The reference pointer in the stack frame points to the newly allocated heap block.\n\nObject Characteristics:\n- State: The specific data values stored in the object's instance fields at any given point in time.\n- Behavior: How the object responds to method calls and alters its own state or interacts with other objects.\n- Identity: A unique memory reference that distinguishes an object from all other objects in the system, even if their field values are completely identical.",
        diagram: `+-------------------------------------------------------------+
|                 Stack vs Heap Object Memory                 |
+-------------------------------------------------------------+
| STACK FRAME (Method Scope)       HEAP MEMORY                |
| +-------------------------+      +------------------------+ |
| | OrderRef order1 (0x800) |----->| Object Header (Mark/V) | |
| +-------------------------+      | orderId: 101           | |
| | OrderRef order2 (0x840) |--+   | amount: 250.00         | |
| +-------------------------+  |   +------------------------+ |
|                              |                              |
|                              |   +------------------------+ |
|                              +-->| Object Header (Mark/V) | |
|                                  | orderId: 101           | |
|                                  | amount: 250.00         | |
|                                  +------------------------+ |
|                                                             |
| order1 == order2 evaluates to FALSE (Different Identity)    |
| order1.equals(order2) evaluates to TRUE (Identical State)   |
+-------------------------------------------------------------+`,
        codeSnippet: {
          language: "java",
          code: `// Class definition (Blueprint)
public class BankAccount {
    private final String accountNumber;
    private double balance; // State

    public BankAccount(String accountNumber, double initialBalance) {
        if (initialBalance < 0) {
            throw new IllegalArgumentException("Initial balance cannot be negative");
        }
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    // Behavior: enforces invariant that balance never drops below zero
    public synchronized void withdraw(double amount) {
        if (amount <= 0 || amount > balance) {
            throw new IllegalStateException("Insufficient funds or invalid amount");
        }
        this.balance -= amount;
    }

    public double getBalance() {
        return balance;
    }
}`,
        },
        interviewWatchout:
          "Be ready to explain the difference between identity ('==' reference comparison) and equality ('.equals()' value comparison). Always point out that two objects with identical fields remain distinct objects with unique memory identities.",
      },
      {
        id: "oop-1-3",
        title: "Fields, Methods, and Object Interaction",
        moduleName: "1. OOP Foundations",
        readTime: "5 min read",
        summary:
          "Objects collaborate through message passing: invoking methods on references. Well-designed objects adhere to 'Tell, Don't Ask' to prevent leaky abstractions.",
        keyInvariants: [
          "Instance fields store mutable or immutable object state; instance methods define executable operations on that state.",
          "Message Passing: In pure OOP theory, calling a method is sending a message requesting the target object to execute a behavior.",
          "'Tell, Don't Ask': Code should tell an object what to do rather than querying its internal state, making decisions externally, and writing results back.",
        ],
        detailedContent:
          "In procedural code, procedures query data from structs, perform business calculations, and update the struct fields directly. In OOP, this is considered an anti-pattern known as Feature Envy or an Anemic Domain Model.\n\nThe 'Tell, Don't Ask' principle dictates that logic operating on an object's state must live inside that object. Calling code instructs the object to perform an action, and the object manages its own state transitions while upholding business invariants.\n\nMessage Passing Mechanics:\n1. Sender invokes a method signature on a receiver reference.\n2. Receiver evaluates arguments and its own internal state.\n3. Receiver mutates internal state if valid, or raises an exception if invariants are violated.\n4. Receiver returns an immutable result or status to the sender.",
        codeSnippet: {
          language: "java",
          code: `// VIOLATION: "Ask, Then Do" (Procedural Anemic Style)
if (account.getBalance() >= chargeAmount) {
    account.setBalance(account.getBalance() - chargeAmount);
    ledger.recordTransaction(account.getId(), chargeAmount);
}

// ADHERENCE: "Tell, Don't Ask" (Object-Oriented Style)
// The Account object internally verifies funds and raises an exception if invalid
account.debit(chargeAmount);
ledger.recordTransaction(account.getId(), chargeAmount);`,
        },
        interviewWatchout:
          "Watch out for indiscriminate getters and setters. If every private field has a public getter and setter, encapsulation is broken and the class is merely an open struct masquerading as an object.",
      },
      {
        id: "oop-1-4",
        title: "Constructors and Object Lifecycle",
        moduleName: "1. OOP Foundations",
        readTime: "6 min read",
        summary:
          "Constructors guarantee that objects enter memory in a fully valid, invariant-compliant state. The lifecycle spans allocation, initialization, active use, and garbage collection or destruction.",
        keyInvariants: [
          "A constructor is not a method: it has no return type and is invoked automatically during instantiation to initialize state.",
          "Constructor Chaining: Subclasses MUST call a superclass constructor before executing child initialization code.",
          "An object must never leak its 'this' reference from within its constructor before initialization is fully complete.",
        ],
        detailedContent:
          "The primary mandate of a constructor is invariant establishment: an object should never exist in an uninitialized or corrupt state.\n\nObject Creation Sequence:\n1. Class Loading: If not already loaded, the JVM/runtime loads the class, verifies bytecode, and initializes static members.\n2. Memory Allocation: The memory manager allocates contiguous heap bytes for the object header and instance fields.\n3. Default Zeroing: All fields are initialized to binary zero (0, false, null).\n4. Field Initializers: Explicit instance variable initializers and instance initializer blocks run in textual order.\n5. Constructor Body: The constructor code executes, starting with `super(...)` if inheriting, followed by specific initialization parameters.\n\nResource Cleanup:\n- C++: Uses deterministic destructors (`~ClassName()`) and RAII (Resource Acquisition Is Initialization), freeing memory and file descriptors immediately when scope exits.\n- Java/C#: Uses non-deterministic Garbage Collection (Tracing GC). Finalizers are deprecated due to unpredictable latency, resurrection bugs, and memory leaks. Modern runtimes require `AutoCloseable` with `try-with-resources`.",
        diagram: `+-------------------------------------------------------------+
|                  Object Lifecycle Pipeline                  |
+-------------------------------------------------------------+
|  [ 1. Class Loaded ]                                        |
|         |                                                   |
|         v                                                   |
|  [ 2. Heap Allocated ] (Space reserved for fields + header) |
|         |                                                   |
|         v                                                   |
|  [ 3. Default Zeroing ] (Primitives to 0, references to null)|
|         |                                                   |
|         v                                                   |
|  [ 4. super() Chaining ] (Base classes initialized first)   |
|         |                                                   |
|         v                                                   |
|  [ 5. Constructor Executed ] (Invariants enforced)          |
|         |                                                   |
|         v                                                   |
|  [ 6. Active Referencing ] (Methods called in app)          |
|         |                                                   |
|         v (References dropped / Out of scope)               |
|  [ 7. Unreachable / GC Mark ] (Swept or compacted by GC)   |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "Explain why 'this escape' in constructors is dangerous: passing 'this' to an event listener or background thread before the constructor finishes lets outside threads observe an incomplete, half-initialized object.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 2: Encapsulation and Abstraction (4 Topics)
  // ----------------------------------------------------
  {
    id: "oop-mod-2",
    name: "2. Encapsulation and Abstraction",
    topics: [
      {
        id: "oop-2-1",
        title: "Encapsulation",
        moduleName: "2. Encapsulation and Abstraction",
        readTime: "6 min read",
        summary:
          "Encapsulation is the bundling of data and the methods that operate on that data into a single unit, while restricting direct access to internal components to enforce invariants.",
        keyInvariants: [
          "Data Hiding is the mechanism; Invariant Protection is the purpose of encapsulation.",
          "Internal representation can change completely (e.g. array to hash map) without breaking any external callers.",
          "Returning mutable references from getters violates encapsulation unless defensive copies are made.",
        ],
        detailedContent:
          "Encapsulation is frequently trivialized as 'making fields private and adding getters and setters'. In reality, true encapsulation is about invariant defense.\n\nAn invariant is a condition that must always be true for an object to be considered valid (e.g., 'a bank balance cannot be negative', 'an end time must be after start time'). When fields are public, external code can violate invariants arbitrarily. When fields are private, every modification is forced through member methods that validate input before updating state.\n\nDefensive Copying Hazard:\nIf a class encapsulates a mutable object (like a `Date` or `List`) and returns it directly from a getter, external callers obtain a direct pointer to internal state and can mutate it without class knowledge. Encapsulation requires creating defensive copies in both constructors and getters, or using unmodifiable wrappers.",
        codeSnippet: {
          language: "java",
          code: `// Encapsulation broken via reference leaking
public class Schedule {
    private final List<String> tasks;

    public Schedule(List<String> tasks) {
        // HAZARD: Direct assignment shares the external list reference
        this.tasks = new ArrayList<>(tasks); // Defensive copy in constructor
    }

    public List<String> getTasks() {
        // HAZARD: returning 'tasks' directly allows external callers to do .clear()
        return Collections.unmodifiableList(tasks); // Safe defensive wrapper
    }
}`,
        },
        interviewWatchout:
          "Staff interviewers often test your understanding of encapsulation by showing a class with private fields that returns a mutable `List` or `Date`. Always call out the reference leak and prescribe unmodifiable collections or defensive copies.",
      },
      {
        id: "oop-2-2",
        title: "Access Modifiers",
        moduleName: "2. Encapsulation and Abstraction",
        readTime: "5 min read",
        summary:
          "Access modifiers define the visibility and accessibility boundaries of classes, fields, constructors, and methods, enforcing the Principle of Least Privilege.",
        keyInvariants: [
          "Follow the Principle of Least Privilege: Start with 'private' and expand visibility only when strictly necessary.",
          "'protected' grants access to subclasses and package peers; it breaches encapsulation across package boundaries.",
          "Public fields should be reserved strictly for immutable constants ('public static final').",
        ],
        detailedContent:
          "Access modifiers dictate how compiler symbol resolution and bytecode verifiers restrict member access. Proper use of modifiers prevents accidental tight coupling between unrelated subsystems.\n\nVisibility Hierarchy (e.g., Java):\n1. `private`: Accessible only within the declaring top-level class. Ideal for fields and internal helper methods.\n2. Default (Package-Private): Accessible only within the same package. Useful for package-internal service implementations not intended for external library consumers.\n3. `protected`: Accessible within the declaring package AND by derived subclasses in different packages.\n4. `public`: Accessible anywhere in the application or module.\n\nThe Protected Dilemma:\nWhile `protected` allows subclass customization, it couples the parent class implementation to derived classes. If parent internal field representations change, derived classes break. Prefer protected methods over protected fields.",
        comparisonTable: {
          headers: ["Access Modifier", "Same Class", "Same Package", "Subclass (Diff Pkg)", "World"],
          rows: [
            ["private", "Yes", "No", "No", "No"],
            ["default (package-private)", "Yes", "Yes", "No", "No"],
            ["protected", "Yes", "Yes", "Yes", "No"],
            ["public", "Yes", "Yes", "Yes", "Yes"],
          ],
        },
        interviewWatchout:
          "Remember that in Java, 'default' access means package-private, NOT protected. In C++, default access in a `class` is private, whereas in a `struct` it is public.",
      },
      {
        id: "oop-2-3",
        title: "Abstraction",
        moduleName: "2. Encapsulation and Abstraction",
        readTime: "5 min read",
        summary:
          "Abstraction hides low-level mechanical complexity behind simplified, high-level behavioral contracts, enabling developers to reason about systems without tracking implementation details.",
        keyInvariants: [
          "Encapsulation hides data and implementation details; Abstraction hides conceptual complexity and highlights essential interfaces.",
          "High abstraction levels decouple high-level business policies from low-level I/O, database, or network mechanisms.",
          "Good abstractions are intuitive, cohesive, and resilient to changes in underlying technology.",
        ],
        detailedContent:
          "Abstraction is the process of eliminating non-essential details to highlight features that matter to the consumer. For example, when you depress a car's brake pedal, you interact with an abstraction: 'slow down vehicle'. You do not manage master cylinder hydraulic pressure, ABS modulation pulses, or brake caliper friction coefficients.\n\nIn software architecture, abstraction allows developers to build layers:\n- Low Level: Sockets, raw TCP byte streams, buffer offsets.\n- Mid Level: HTTP client, request serialization, connection pooling.\n- High Level Abstraction: `PaymentService.charge(customerId, amount)`.\n\nBy programming against abstractions rather than concrete implementations, the payment gateway can be swapped from Stripe to Adyen without touching domain logic.",
        diagram: `+-------------------------------------------------------------+
|               Abstraction vs Encapsulation                  |
+-------------------------------------------------------------+
| ABSTRACTION: "What does it do?"                             |
|   Interface: PaymentGateway                                 |
|   Contract: +processPayment(amount: Decimal): Transaction   |
|   (Hides complexity: network retries, TLS handshakes, APIs) |
|                                                             |
|                         ^                                   |
|                         | Implemented By                    |
|                         v                                   |
|                                                             |
| ENCAPSULATION: "How does it hide and protect its state?"    |
|   Class: StripePaymentGateway implements PaymentGateway     |
|   Private: apiKey, timeoutMs, connectionPool, cipherState   |
|   (Restricts direct access to internal mechanics)           |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "When asked 'What is the difference between Encapsulation and Abstraction?', remember: Encapsulation is about INFORMATION HIDING and INVARIANT PROTECTION (containment); Abstraction is about COMPLEXITY REDUCTION and CONTRACT DEFINITION (representation).",
      },
      {
        id: "oop-2-4",
        title: "Abstract Classes and Interfaces",
        moduleName: "2. Encapsulation and Abstraction",
        readTime: "6 min read",
        summary:
          "Abstract classes provide partial blueprints with shared state and default implementations, while Interfaces define pure behavioral contracts supporting multiple inheritance.",
        keyInvariants: [
          "An Abstract Class cannot be instantiated directly; it can declare state (instance fields) and constructors.",
          "An Interface defines a contract; in modern languages it can provide default methods but cannot hold instance state.",
          "A class can implement multiple interfaces, but can extend only one abstract or concrete class in single-inheritance languages.",
        ],
        detailedContent:
          "Choosing between an Abstract Class and an Interface is one of the most critical design decisions in object-oriented architecture.\n\nAbstract Classes:\n- Used when classes share a strong IS-A relationship and common identity.\n- Can maintain state (instance fields) and declare constructors that derived classes invoke via `super()`.\n- Ideal for the Template Method Pattern: defining an invariant skeletal algorithm workflow in the base class while leaving specific steps abstract for subclasses to implement.\n\nInterfaces:\n- Used to define capabilities across unrelated class hierarchies (e.g., `Comparable`, `Serializable`, `AutoCloseable`).\n- A class can implement dozens of interfaces, enabling flexible polymorphic behavior without rigid inheritance trees.\n- Interfaces cannot store instance state (fields are implicitly `public static final` constants in Java).",
        comparisonTable: {
          headers: ["Feature", "Abstract Class", "Interface"],
          rows: [
            ["Inheritance", "Single inheritance only (`extends`)", "Multiple inheritance allowed (`implements`)"],
            ["Instance State", "Can have instance fields (`private int x;`)", "No instance fields (only static constants)"],
            ["Constructors", "Yes (invoked by subclass constructors)", "No constructors allowed"],
            ["Method Implementation", "Can provide full, partial, or no code", "Abstract by default (supports default methods)"],
            ["Speed", "Slightly faster direct vtable offset", "Interface dispatch table (itable) has minor indirection"],
            ["Design Intent", "Code sharing & template algorithms", "Behavioral contract across unrelated types"],
          ],
        },
        codeSnippet: {
          language: "java",
          code: `// Interface: defines a capability contract
public interface Encryptor {
    byte[] encrypt(byte[] data);
    byte[] decrypt(byte[] payload);
}

// Abstract Class: shares common initialization and template workflow
public abstract class BaseReportGenerator {
    private final DataSource dataSource;

    protected BaseReportGenerator(DataSource ds) {
        this.dataSource = ds;
    }

    // Template Method: Skeleton algorithm
    public final Report buildReport() {
        Data data = dataSource.fetch();
        FormattedData formatted = formatData(data); // Abstract hook
        return generateOutput(formatted);           // Abstract hook
    }

    protected abstract FormattedData formatData(Data data);
    protected abstract Report generateOutput(FormattedData data);
}`,
        },
        interviewWatchout:
          "Do not answer that interfaces cannot have method bodies. Modern Java (Java 8+) supports default and static methods, and Java 9+ supports private interface methods. The defining distinction is that interfaces cannot store mutable instance state.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 3: Inheritance and Object Relationships (4 Topics)
  // ----------------------------------------------------
  {
    id: "oop-mod-3",
    name: "3. Inheritance and Object Relationships",
    topics: [
      {
        id: "oop-3-1",
        title: "Inheritance",
        moduleName: "3. Inheritance and Object Relationships",
        readTime: "6 min read",
        summary:
          "Inheritance allows a derived class to acquire fields and methods from a parent class, facilitating code reuse and establishing polymorphic type hierarchies.",
        keyInvariants: [
          "Inheritance models an IS-A relationship: every instance of a derived class MUST be a valid instance of the base class.",
          "Subclass constructors must invoke a base class constructor before running child constructor logic.",
          "Overuse of inheritance creates tight coupling, known as the Fragile Base Class Problem.",
        ],
        detailedContent:
          "Inheritance enables hierarchical classification. A subclass inherits all accessible fields and methods from its superclass and can add new fields, declare new methods, or override inherited methods to customize behavior.\n\nInitialization Chain:\nWhen an instance of a subclass is instantiated, memory for the entire inheritance hierarchy is allocated in a single heap block. The runtime guarantees that the root superclass constructor runs first, followed sequentially by each descendant down to the child class constructor.\n\nThe Fragile Base Class Problem:\nBecause a subclass depends intimately on the internal implementation of its superclass, modifications to the base class can silently break subclass invariants. For example, if a base class changes an internal method from self-contained execution to calling an overridable method, a subclass overriding that method may inadvertently enter an infinite loop or double-count operations.",
        codeSnippet: {
          language: "java",
          code: `public class Vehicle {
    private final String vin;

    public Vehicle(String vin) {
        this.vin = vin;
    }

    public void start() {
        System.out.println("Ignition sequence initiated.");
    }
}

public class ElectricCar extends Vehicle {
    private int batteryPercentage;

    public ElectricCar(String vin, int initialBattery) {
        super(vin); // MANDATORY: super constructor runs first
        this.batteryPercentage = initialBattery;
    }

    @Override
    public void start() {
        // Customizes inherited behavior
        System.out.println("High voltage contactors closed. Motor ready.");
    }
}`,
        },
        interviewWatchout:
          "Explain the Fragile Base Class problem clearly. Mention that changes in superclass private method interactions can break subclass functionality even without compile-time warnings.",
      },
      {
        id: "oop-3-2",
        title: "Types of Inheritance",
        moduleName: "3. Inheritance and Object Relationships",
        readTime: "5 min read",
        summary:
          "Object-oriented languages support Single, Multilevel, and Hierarchical inheritance, while handling Multiple Inheritance with care to prevent the Diamond Problem.",
        keyInvariants: [
          "Single Inheritance: A class derives from exactly one direct base class.",
          "Multilevel Inheritance: Class C extends Class B, which extends Class A.",
          "Multiple Class Inheritance introduces ambiguity (the Diamond Problem); Java and C# avoid it by disallowing multiple class inheritance.",
        ],
        detailedContent:
          "Inheritance patterns vary across programming languages:\n1. Single Inheritance: Class B extends Class A (Standard in Java, C#, Swift).\n2. Multilevel Inheritance: Grandparent -> Parent -> Child. Forms an inheritance chain.\n3. Hierarchical Inheritance: Multiple distinct subclasses extend a single shared parent class (e.g., Dog extends Animal, Cat extends Animal).\n4. Multiple Inheritance: A class extends two or more classes simultaneously (Allowed in C++, Python).\n\nThe Diamond Problem:\nSuppose Class A defines `virtual void print()`. Class B and Class C both inherit from A and override `print()`. Class D inherits from both B and C without overriding `print()`. When `d.print()` is invoked, which version should execute: B's or C's? Furthermore, does D contain one copy of A's fields or two?\n- C++ resolves this via Virtual Inheritance (`class B : virtual public A`).\n- Python resolves this via Method Resolution Order (MRO) using the C3 Linearization algorithm.\n- Java and C# eliminate the ambiguity entirely by restricting classes to single inheritance, allowing multiple inheritance only for stateless interfaces.",
        diagram: `+-------------------------------------------------------------+
|                 The Diamond Problem of OOP                  |
+-------------------------------------------------------------+
|                          [ Class A ]                        |
|                         (void display)                      |
|                           /       \\                         |
|                          /         \\                        |
|                         /           \\                       |
|               [ Class B ]           [ Class C ]             |
|            (overrides display)    (overrides display)       |
|                         \\           /                       |
|                          \\         /                        |
|                           \\       /                         |
|                          [ Class D ]                        |
|                               ?                             |
|          Which display() does Class D inherit?              |
|          How many copies of Class A's fields exist?         |
+-------------------------------------------------------------+`,
        interviewWatchout:
          "If asked how Java handles the Diamond Problem with Java 8 default methods in interfaces, answer: If a class implements two interfaces with identical default method signatures, the compiler throws an error and forces the developer to explicitly override the method and resolve ambiguity (e.g. `InterfaceA.super.method()`).",
      },
      {
        id: "oop-3-3",
        title: "IS-A and HAS-A Relationships",
        moduleName: "3. Inheritance and Object Relationships",
        readTime: "5 min read",
        summary:
          "IS-A denotes inheritance or interface implementation, while HAS-A denotes composition or aggregation. Architecture best practices mandate favoring HAS-A over IS-A.",
        keyInvariants: [
          "IS-A expresses subtype relationship and polymorphism (Dog IS-A Animal).",
          "HAS-A expresses containment and delegation (Car HAS-A Engine).",
          "Favor Composition over Inheritance: HAS-A yields looser coupling, higher testability, and runtime behavioral mutability.",
        ],
        detailedContent:
          "Distinguishing between IS-A and HAS-A is fundamental to clean architecture.\n\nIS-A (Inheritance):\n- Static: Bound at compile time. An instance of `Sedan` cannot dynamically become a `Truck` at runtime.\n- Exposes internals: Subclasses inherit all public and protected base members, even those irrelevant or inappropriate for the subclass.\n- Must satisfy the Liskov Substitution Principle: anywhere a base reference is expected, a child reference must work without altering correctness.\n\nHAS-A (Composition):\n- Dynamic: Components can be swapped or injected at runtime (e.g., swapping a `V6Engine` with an `ElectricMotor`).\n- Black-box reuse: The host class knows only the public interface of its composed components.\n- Easy unit testing: Dependencies can be mocked or stubbed effortlessly.",
        codeSnippet: {
          language: "java",
          code: `// BAD PRACTICE: Inappropriate IS-A (Inheritance)
// Stack is NOT a Vector; exposing Vector methods like insertElementAt() corrupts LIFO invariants!
public class BadStack<T> extends Vector<T> { ... }

// GOOD PRACTICE: HAS-A (Composition)
public class GoodStack<T> {
    private final Deque<T> storage = new ArrayDeque<>(); // HAS-A

    public void push(T item) {
        storage.push(item);
    }

    public T pop() {
        return storage.pop();
    }
}`,
        },
        interviewWatchout:
          "Cite the classic JDK flaw: `java.util.Stack extends Vector` and `java.util.Properties extends Hashtable`. Both are famous examples where inheritance was mistakenly used instead of composition, exposing methods that violate the data structure's invariants.",
      },
      {
        id: "oop-3-4",
        title: "Association, Aggregation, and Composition",
        moduleName: "3. Inheritance and Object Relationships",
        readTime: "6 min read",
        summary:
          "Association models structural peer connections. Aggregation represents a weak whole-part relationship with independent lifecycles, while Composition represents strong whole-part ownership with coupled lifecycles.",
        keyInvariants: [
          "Association: General connection where objects interact independently (peer-to-peer).",
          "Aggregation: Weak 'has-a' relationship; part can exist independently of the whole (Department has Professors).",
          "Composition: Strong 'has-a' relationship; part cannot exist without the whole; destroying the whole destroys the part (House has Rooms).",
        ],
        detailedContent:
          "Object relationship taxonomy:\n\n1. Association:\nA general structural connection where two objects interact. Neither owns the other. (e.g., A `Doctor` and a `Patient`. A doctor treats many patients; patients visit many doctors. Both exist independently).\n\n2. Aggregation (Weak Has-A):\nA unidirectional relationship representing ownership, but with independent lifecycles. The container holds references to objects created externally.\n- Example: A `UniversityDepartment` and a `Professor`. If the department closes, the professors do not get destroyed; they move to other departments.\n- UML: Hollow diamond at the container end.\n\n3. Composition (Strong Has-A):\nA strict relationship where the container creates and exclusively owns the lifecycle of its child objects.\n- Example: An `Order` and its `OrderLineItems`. An order line item cannot exist without its parent order. If the order is deleted from the database, all its line items are cascaded and deleted.\n- UML: Filled (solid) black diamond at the container end.",
        comparisonTable: {
          headers: ["Relationship", "Coupling", "Lifecycle Dependency", "UML Notation", "Real-World Example"],
          rows: [
            ["Association", "Loose", "Completely independent", "Solid line with arrow", "Driver and Car"],
            ["Aggregation", "Moderate", "Independent (Child outlives parent)", "Hollow diamond", "Department and Professor"],
            ["Composition", "Tight", "Dependent (Child destroyed with parent)", "Solid filled diamond", "House and Rooms"],
          ],
        },
        interviewWatchout:
          "Interviewers frequently ask: 'If an Order object is deleted, what happens to its OrderItems vs its Customer?' The correct answer: Order to OrderItems is COMPOSITION (OrderItems are deleted); Order to Customer is AGGREGATION or ASSOCIATION (Customer persists).",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 4: Polymorphism and Binding (3 Topics)
  // ----------------------------------------------------
  {
    id: "oop-mod-4",
    name: "4. Polymorphism and Binding",
    topics: [
      {
        id: "oop-4-1",
        title: "Polymorphism",
        moduleName: "4. Polymorphism and Binding",
        readTime: "5 min read",
        summary:
          "Polymorphism allows objects of different types to be treated through a unified interface, decoupling client code from concrete implementations.",
        keyInvariants: [
          "Polymorphism enables the Open/Closed Principle: systems can be extended with new types without modifying existing dispatch logic.",
          "Subtype polymorphism relies on dynamic dispatch and runtime method lookup.",
          "Parametric polymorphism (Generics/Templates) enables type-safe code reuse at compile time.",
        ],
        detailedContent:
          "The word polymorphism means 'having multiple forms'. In object-oriented programming, it enables a single interface or reference type to represent entities of different concrete types.\n\nCategories of Polymorphism:\n1. Subtype Polymorphism (Inclusion Polymorphism): A superclass or interface reference points to a subclass instance at runtime. The runtime determines which implementation to invoke (`Shape s = new Circle(); s.draw();`).\n2. Ad-hoc Polymorphism (Method Overloading): Multiple functions with identical names but different parameter lists within the same scope.\n3. Parametric Polymorphism (Generics / Templates): Writing algorithms and data structures without committing to specific concrete types (`List<T>`), verified at compile time.\n4. Coercion Polymorphism: Implicit type casting performed by the language (e.g., passing an `int` to a function expecting a `double`).",
        interviewWatchout:
          "Staff interviewers want to hear you categorize polymorphism into Subtype, Ad-hoc, and Parametric polymorphism, rather than just reciting 'compile-time vs runtime'.",
      },
      {
        id: "oop-4-2",
        title: "Method Overloading vs. Method Overriding",
        moduleName: "4. Polymorphism and Binding",
        readTime: "6 min read",
        summary:
          "Overloading provides compile-time polymorphism with identical names but differing parameters. Overriding provides runtime polymorphism by substituting parent behavior with child implementations.",
        keyInvariants: [
          "Overloading is resolved at compile time based on static reference types (Early Binding).",
          "Overriding is resolved at runtime based on the actual heap object instance (Late Binding).",
          "An overriding method CANNOT reduce the access visibility of the superclass method, but CAN make it more accessible.",
          "An overriding method can return a subtype of the superclass method return type (Covariant Return Type).",
        ],
        detailedContent:
          "Method Overloading (Compile-Time Polymorphism):\n- Occurs within the same class or inherited from a parent.\n- Method names are identical, but method signatures MUST differ in parameter count, parameter types, or parameter order.\n- Return type alone cannot distinguish overloaded methods because callers may ignore return values.\n\nMethod Overriding (Runtime Polymorphism):\n- Occurs across an inheritance boundary between parent and child.\n- Method signature (name and parameter types) must be identical.\n- Rules for Overriding:\n  1. Visibility: Child cannot be more restrictive than parent (e.g., `protected` in parent cannot become `private` in child).\n  2. Exceptions: Child cannot throw broader checked exceptions than declared in parent.\n  3. Covariant Returns: Child can return a subtype of the parent's declared return type.\n  4. `private`, `static`, and `final` methods cannot be overridden.",
        comparisonTable: {
          headers: ["Criterion", "Method Overloading", "Method Overriding"],
          rows: [
            ["Resolution Time", "Compile time (Static Binding)", "Runtime (Dynamic Binding)"],
            ["Method Signature", "Must differ in parameters", "Must be identical"],
            ["Class Boundary", "Same class or hierarchy", "Subclass overriding parent"],
            ["Return Type", "Can be different or same", "Must be identical or covariant subtype"],
            ["Private/Static Methods", "Can be overloaded", "Cannot be overridden"],
            ["Performance Cost", "Zero runtime overhead", "Vtable indirect call overhead"],
          ],
        },
        codeSnippet: {
          language: "java",
          code: `class Parent {
    public Number calculate(int x) { return x * 1.0; }
}

class Child extends Parent {
    // METHOD OVERLOADING (different parameter type: double instead of int)
    public Number calculate(double x) { return x * 2.0; }

    // METHOD OVERRIDING (identical signature, covariant return type: Integer is-a Number)
    @Override
    public Integer calculate(int x) { return x * 10; }
}`,
        },
        interviewWatchout:
          "A classic trick question: If a method signature in a child class differs by parameter types from a parent method, is it overriding? No, it is OVERLOADING. Always use the `@Override` annotation so the compiler catches accidental parameter mismatches.",
      },
      {
        id: "oop-4-3",
        title: "Dynamic Binding and Type Casting",
        moduleName: "4. Polymorphism and Binding",
        readTime: "6 min read",
        summary:
          "Dynamic binding resolves method calls at runtime using Virtual Method Tables (vtables). Upcasting is safe and implicit, while Downcasting requires runtime type checks.",
        keyInvariants: [
          "Static Binding applies to 'private', 'final', and 'static' methods where target addresses are fixed at compile time.",
          "Dynamic Binding uses a vtable (virtual method table) in the object header to resolve method addresses at runtime.",
          "Upcasting (Subclass to Superclass) is always type-safe; Downcasting (Superclass to Subclass) requires runtime verification and can throw ClassCastException.",
        ],
        detailedContent:
          "How Dynamic Binding Works under the Hood:\nEvery object instantiated in heap memory includes an object header containing a pointer to its class's Virtual Method Table (vtable). A vtable is an array of function pointers created by the compiler for all virtual methods.\n\nWhen a virtual method is called on a reference (`animal.makeSound()`):\n1. The CPU loads the object's memory address from the reference variable.\n2. It follows the header pointer to locate the class's vtable in metadata memory.\n3. It indexes into the vtable at a pre-compiled fixed offset (e.g. index 3 for `makeSound`).\n4. It executes a jump instruction to the function pointer stored at that offset.\n\nType Casting:\n- Upcasting: Casting a derived reference to a base reference (`Animal a = new Dog()`). Always safe because every Dog is an Animal.\n- Downcasting: Casting a base reference down to a derived type (`Dog d = (Dog) a`). Risky: if the underlying object is a `Cat`, the runtime throws `ClassCastException`. Always verify using `instanceof` or pattern matching.",
        diagram: `+-------------------------------------------------------------+
|             Virtual Method Table (vtable) Dispatch          |
+-------------------------------------------------------------+
| STACK:                      HEAP:                           |
| Animal ref (0x1000) ------> [ Dog Object Instance ]         |
|                             | Object Header (Mark Word)     |
|                             | vptr (points to Dog vtable) --+
|                             | breed: "Labrador"             |
|                             +-------------------------------+
|                                            |
|                                            v
|                             [ Dog Class vtable ]
|                             | [0] toString() -> Object.toString
|                             | [1] equals()   -> Object.equals
|                             | [2] makeSound()-> Dog::makeSound()
|                             +-------------------------------+
|
| CPU resolves: ref->vptr->[2]() in O(1) time without conditionals!
+-------------------------------------------------------------+`,
        interviewWatchout:
          "Explain why `private`, `static`, and `final` methods do not use dynamic dispatch: The compiler knows these methods can never be overridden, so it binds them directly at compile time (static binding), eliminating vtable lookup overhead and enabling method inlining.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 5: Important Class and Object Concepts (4 Topics)
  // ----------------------------------------------------
  {
    id: "oop-mod-5",
    name: "5. Important Class and Object Concepts",
    topics: [
      {
        id: "oop-5-1",
        title: "this, super, and Object Context",
        moduleName: "5. Important Class and Object Concepts",
        readTime: "5 min read",
        summary:
          "The 'this' keyword provides an implicit reference to the current instance, while 'super' accesses parent class members and constructor forwarding.",
        keyInvariants: [
          "'this' refers to the executing object instance; it is unavailable in static methods because static methods execute without an object context.",
          "'this()' and 'super()' constructor forwarding calls MUST be the very first statement in a constructor.",
          "Leaking 'this' in constructors before field initialization finishes leads to concurrency race conditions.",
        ],
        detailedContent:
          "Understanding execution context is vital for clean object design.\n\nThe `this` Keyword:\n- Resolves variable shadowing: Distinguishes instance fields from parameter variables having the same name (`this.userId = userId`).\n- Constructor Chaining: Reuses constructor logic (`this(name, DEFAULT_TIMEOUT)`).\n- Method Chaining: Returns the current instance (`return this`) to implement the Fluent Interface / Builder pattern.\n- Callback registration: Passes the current instance as a listener to an event bus.\n\nThe `super` Keyword:\n- Constructor invocation: Invokes base class constructors (`super(id, name)`).\n- Bypassing overrides: Allows a subclass method to call the parent's original implementation (`super.execute()` before adding supplementary child logic).",
        codeSnippet: {
          language: "java",
          code: `public class ConnectionBuilder {
    private String host = "localhost";
    private int port = 5432;

    public ConnectionBuilder setHost(String host) {
        this.host = host; // Variable shadowing resolution
        return this;      // Fluent method chaining
    }

    public ConnectionBuilder setPort(int port) {
        this.port = port;
        return this;
    }
}`,
        },
        interviewWatchout:
          "Why can't `this()` and `super()` appear in the same constructor? Because `this()` chains to another constructor of the current class, which will ultimately execute `super()`. Having both would cause duplicate base class initialization.",
      },
      {
        id: "oop-5-2",
        title: "Static vs. Instance Members",
        moduleName: "5. Important Class and Object Concepts",
        readTime: "6 min read",
        summary:
          "Static members belong to the class itself and are shared across all instances, whereas instance members are allocated uniquely per object in the heap.",
        keyInvariants: [
          "Static variables exist once per ClassLoader in Metaspace/Class memory, regardless of how many instances exist.",
          "Static methods cannot access 'this', 'super', or any instance variables directly.",
          "Mutable static variables are notorious sources of concurrency bugs, hidden global state, and test contamination.",
        ],
        detailedContent:
          "Memory & Lifecycle Differences:\n- Instance Variables: Allocated in heap memory each time `new` is called. Each instance has its own distinct copy. Destroyed when the object is garbage collected.\n- Static Variables: Allocated once when the class is loaded by the ClassLoader. Shared by all instances of the class. Persist until the ClassLoader is unloaded.\n\nStatic Methods:\n- Do not receive an implicit `this` pointer argument.\n- Ideal for pure mathematical or utility functions that depend strictly on input parameters (e.g., `Math.sqrt()`, `Collections.sort()`).\n- Cannot be polymorphically overridden in the traditional sense; declaring a static method with the same signature in a subclass merely 'hides' the parent method at compile time.\n\nArchitectural Caution:\nGlobal mutable state disguised as static fields breaks modularity, violates thread safety, and prevents parallel unit testing. Prefer Dependency Injection of singleton services over static global access.",
        comparisonTable: {
          headers: ["Attribute", "Instance Members", "Static Members"],
          rows: [
            ["Memory Allocation", "Heap per object creation", "Metaspace/Class area on class load"],
            ["Access Mechanism", "Via object reference (`obj.field`)", "Via Class name (`Class.field`)"],
            ["Availability of 'this'", "Yes (implicit pointer passed)", "No ('this' is undefined)"],
            ["Polymorphism", "Dynamic dispatch via vtable", "Method hiding at compile time (no vtable)"],
            ["Unit Testing", "Easy to isolate and mock", "Difficult to mock without bytecode manipulation"],
          ],
        },
        interviewWatchout:
          "Can static methods be overridden? The answer is NO. They can be hidden (shadowed), but runtime dynamic dispatch does not apply to static methods. Method calls are resolved based on the reference type at compile time.",
      },
      {
        id: "oop-5-3",
        title: "Identity, Equality, and Copying",
        moduleName: "5. Important Class and Object Concepts",
        readTime: "6 min read",
        summary:
          "Identity compares memory addresses ('=='), while Equality compares state semantics ('.equals()'). The equals/hashCode contract is mandatory for collection correctness.",
        keyInvariants: [
          "If two objects are equal according to equals(), they MUST have the same hashCode().",
          "If two objects have the same hashCode(), they are NOT necessarily equal (Hash Collision).",
          "Shallow copy copies primitive values and reference addresses; Deep copy recursively clones the entire graph of child objects.",
        ],
        detailedContent:
          "The equals() and hashCode() Contract:\nWhen using hash-based collections (`HashMap`, `HashSet`, `Hashtable`), objects are stored in buckets determined by their `hashCode()`. When looking up an object:\n1. The bucket index is calculated: `index = hashCode() & (bucketArray.length - 1)`.\n2. If a collision exists, the runtime traverses the bucket's linked list or red-black tree, calling `equals()` on each element.\n\nIf you override `equals()` without overriding `hashCode()`, two logically equal objects will produce different hash codes. They will land in different buckets, causing `map.get(equalKey)` to return `null` and `set.contains(equalItem)` to fail!\n\nObject Copying:\n- Shallow Copy: Duplicates the top-level object fields. If fields are reference pointers to other objects, both copies point to the same child objects in heap memory. Mutating a child via copy A mutates copy B!\n- Deep Copy: Duplicates the top-level object AND recursively creates independent duplicates of all referenced child objects. Required when complete object isolation is needed.",
        codeSnippet: {
          language: "java",
          code: `public final class UserKey {
    private final String tenantId;
    private final String userId;

    public UserKey(String tenantId, String userId) {
        this.tenantId = Objects.requireNonNull(tenantId);
        this.userId = Objects.requireNonNull(userId);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true; // Identity check
        if (!(o instanceof UserKey)) return false;
        UserKey other = (UserKey) o;
        return tenantId.equals(other.tenantId) && userId.equals(other.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tenantId, userId); // MUST match equals fields!
    }
}`,
        },
        interviewWatchout:
          "Always state the five rules of the `equals()` contract: Reflexive, Symmetric, Transitive, Consistent, and non-null comparison (`x.equals(null) == false`).",
      },
      {
        id: "oop-5-4",
        title: "Immutability",
        moduleName: "5. Important Class and Object Concepts",
        readTime: "6 min read",
        summary:
          "An immutable object cannot have its state modified after creation. Immutability guarantees thread safety, eliminates defensive copying overhead, and stabilizes hash collections.",
        keyInvariants: [
          "An immutable class must prevent subclassing ('final' class) to stop derived classes from introducing mutable state.",
          "All fields must be 'private final', and constructors must perform defensive copies of mutable input parameters.",
          "No mutator (setter) methods may exist; operations that alter state must return a brand-new instance.",
        ],
        detailedContent:
          "Why Immutability Dominates Modern Software Architecture:\n1. Thread Safety without Synchronization: Multiple threads can read an immutable instance concurrently without mutex locks, race conditions, or memory barriers.\n2. Safe Collection Keys: Once an immutable object is inserted into a `HashMap` or `HashSet`, its hash code will never change. (A mutable key whose fields change after insertion becomes permanently lost in the hash map).\n3. Referential Transparency: Functions taking immutable arguments have no side effects, drastically reducing debugging complexity.\n\nRecipe for Strict Immutability (e.g. Java):\n1. Declare the class `final` so it cannot be extended.\n2. Make all fields `private` and `final`.\n3. Do not provide any mutator (setter) methods.\n4. If fields reference mutable objects (e.g. `Date`, `List`), make defensive copies in the constructor.\n5. Return defensive copies or unmodifiable views in accessor methods.",
        codeSnippet: {
          language: "java",
          code: `// Strictly Immutable Class
public final class ImmutableMoney {
    private final BigDecimal amount;
    private final Currency currency;

    public ImmutableMoney(BigDecimal amount, Currency currency) {
        this.amount = Objects.requireNonNull(amount);
        this.currency = Objects.requireNonNull(currency);
    }

    public BigDecimal getAmount() { return amount; }
    public Currency getCurrency() { return currency; }

    // Mutating operation returns a brand-new instance
    public ImmutableMoney add(ImmutableMoney other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currency mismatch");
        }
        return new ImmutableMoney(this.amount.add(other.amount), this.currency);
    }
}`,
        },
        interviewWatchout:
          "Remember to mention records in modern Java (Java 14+) and `readonly struct` / records in C# as native language features for concise immutable data carriers.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 6: Good OOP Design and Essential Patterns (4 Topics)
  // ----------------------------------------------------
  {
    id: "oop-mod-6",
    name: "6. Good OOP Design and Essential Patterns",
    topics: [
      {
        id: "oop-6-1",
        title: "Coupling, Cohesion, and Composition",
        moduleName: "6. Good OOP Design and Essential Patterns",
        readTime: "6 min read",
        summary:
          "High cohesion ensures a class has a single, well-defined responsibility. Low coupling minimizes dependencies between modules. The Law of Demeter prevents chained property leaks.",
        keyInvariants: [
          "High Cohesion: Elements inside a class belong together and contribute to a single architectural purpose.",
          "Low Coupling: Classes interact through narrow interfaces without knowledge of each other's internal structures.",
          "Law of Demeter (Principle of Least Knowledge): An object should only talk to its immediate dependencies, never to dependencies of its dependencies.",
        ],
        detailedContent:
          "The hallmark of mature software engineering is High Cohesion paired with Low Coupling.\n\nCohesion Metrics:\n- Low Cohesion: A 'God Object' (e.g., `UserManager`) that handles password hashing, database SQL, email notifications, PDF generation, and session caching. Any change anywhere breaks this class.\n- High Cohesion: `PasswordHasher`, `UserDatabaseRepository`, `EmailNotificationService`. Each class has a single reason to change.\n\nCoupling Metrics:\n- Tight Coupling: Class A instantiates concrete Class B directly, relies on B's specific field names, and casts internal types.\n- Loose Coupling: Class A depends on an interface `PaymentGateway`. Any implementation (Stripe, PayPal, Mock) can be swapped without changing Class A.\n\nLaw of Demeter (Principle of Least Knowledge):\nAvoid dot-navigating through multiple objects: `order.getCustomer().getAddress().getZipCode()`. If the internal structure of `Customer` or `Address` changes, this code breaks. Instead, instruct the immediate object to provide the needed result: `order.getDeliveryZipCode()`.",
        interviewWatchout:
          "Identify method chaining anti-patterns like `a.getB().getC().getD().doSomething()` during interview system design exercises and refactor them by introducing delegated wrapper methods that uphold the Law of Demeter.",
      },
      {
        id: "oop-6-2",
        title: "SOLID Principles",
        moduleName: "6. Good OOP Design and Essential Patterns",
        readTime: "7 min read",
        summary:
          "The five SOLID principles provide foundational rules for maintainable, scalable, and testable object-oriented software architecture.",
        keyInvariants: [
          "S - Single Responsibility: A class should have one, and only one, reason to change.",
          "O - Open/Closed: Software entities should be open for extension, but closed for modification.",
          "L - Liskov Substitution: Subtypes must be substitutable for their base types without altering program correctness.",
          "I - Interface Segregation: Clients should not be forced to depend on interfaces they do not use.",
          "D - Dependency Inversion: Depend upon abstractions, not concrete implementations.",
        ],
        detailedContent:
          "The SOLID Principles breakdown:\n\n1. Single Responsibility Principle (SRP):\nA class should encompass a single actor's concerns. If a class formats invoices AND saves them to SQL, it has two reasons to change: accounting formatting changes and database schema migrations. Split into `InvoiceFormatter` and `InvoiceRepository`.\n\n2. Open/Closed Principle (OCP):\nYou should be able to introduce new features without altering tested, working production code. Achieve this by abstracting behaviors behind interfaces. Adding a new payment method means writing a new `CryptoPaymentService implements PaymentService`, rather than adding an `else if (type == CRYPTO)` branch into existing code.\n\n3. Liskov Substitution Principle (LSP):\nDerived classes must honor the contracts of their base classes. Preconditions cannot be strengthened in a subclass; postconditions cannot be weakened. The classic violation: `Square extends Rectangle`. If setting width on a Square alters its height, client code expecting a Rectangle's width and height to be independent breaks!\n\n4. Interface Segregation Principle (ISP):\nPrefer many small, client-specific interfaces over one monolithic 'fat' interface. A `MultiFunctionPrinter` interface requiring `print()`, `scan()`, `fax()`, and `staple()` forces a simple inkjet printer to implement stub or exception-throwing methods for fax and staple. Split into `Printer`, `Scanner`, `FaxMachine`.\n\n5. Dependency Inversion Principle (DIP):\nHigh-level modules should not depend on low-level modules; both should depend on abstractions. Low-level details should depend on abstractions. Inject interfaces via constructors rather than hardcoding `new MySQLDatabase()` inside business services.",
        codeSnippet: {
          language: "java",
          code: `// DIP & OCP Compliant Architecture
public interface NotificationChannel {
    void send(String recipient, String message);
}

public class OrderService {
    private final NotificationChannel notifier; // Depends on abstraction

    // Constructor Injection (Dependency Inversion)
    public OrderService(NotificationChannel notifier) {
        this.notifier = notifier;
    }

    public void completeOrder(Order order) {
        // Business logic...
        notifier.send(order.getCustomerEmail(), "Order confirmed!");
    }
}`,
        },
        interviewWatchout:
          "LSP is the most frequently tested SOLID principle in staff-level interviews. Be ready to explain the Rectangle/Square dilemma and show how inheritance must preserve behavioral contracts, not just geometric classification.",
      },
      {
        id: "oop-6-3",
        title: "Factory and Strategy Patterns",
        moduleName: "6. Good OOP Design and Essential Patterns",
        readTime: "6 min read",
        summary:
          "The Factory pattern decouples object instantiation from consumption, while the Strategy pattern enables dynamic swapping of interchangeable algorithms at runtime.",
        keyInvariants: [
          "Factory Method encapsulates instantiation behind a polymorphic method, eliminating concrete class references in client code.",
          "Strategy Pattern uses composition over inheritance to swap algorithms dynamically at runtime.",
          "Combining Factory and Strategy creates extensible architectures where new algorithms can be configured without modifying calling services.",
        ],
        detailedContent:
          "Creational and Behavioral Pattern Synergy:\n\nFactory Pattern:\n- Problem: When client code uses `new ConcreteProduct()`, it becomes tightly coupled to that specific class. If construction logic requires complex configuration, caching, or dependency wiring, duplication explodes.\n- Solution: A Factory encapsulates instantiation. Client code requests a product via an abstraction: `LoggerFactory.getLogger()`. The factory determines whether to return a `ConsoleLogger`, `FileLogger`, or `CloudWatchLogger`.\n\nStrategy Pattern:\n- Problem: A class needs to support multiple variants of an algorithm (e.g., sorting strategies, routing algorithms, pricing models). Hardcoding conditional `switch` statements violates the Open/Closed Principle.\n- Solution: Define an interface `PricingStrategy`. Implement concrete strategies: `RegularPricing`, `BlackFridayDiscount`, `VIPCustomerPricing`. The host context class holds a reference to the strategy interface and delegates calculation to it. The strategy can be swapped at runtime.",
        codeSnippet: {
          language: "java",
          code: `// Strategy Interface
public interface CompressionStrategy {
    byte[] compress(byte[] input);
}

public class ZipCompression implements CompressionStrategy {
    public byte[] compress(byte[] input) { /* Zip algorithm */ return input; }
}

public class SnappyCompression implements CompressionStrategy {
    public byte[] compress(byte[] input) { /* Snappy fast algorithm */ return input; }
}

// Context: Uses Strategy dynamically
public class ArchiveService {
    private CompressionStrategy strategy;

    public ArchiveService(CompressionStrategy defaultStrategy) {
        this.strategy = defaultStrategy;
    }

    public void setStrategy(CompressionStrategy newStrategy) {
        this.strategy = newStrategy; // Swapped at runtime!
    }

    public byte[] createArchive(byte[] payload) {
        return strategy.compress(payload);
    }
}`,
        },
        interviewWatchout:
          "Explain the difference between Simple Factory (static creation method), Factory Method (inheritance-based factory), and Abstract Factory (factory of factories producing families of related products).",
      },
      {
        id: "oop-6-4",
        title: "Observer and Singleton Patterns",
        moduleName: "6. Good OOP Design and Essential Patterns",
        readTime: "6 min read",
        summary:
          "Observer establishes a one-to-many publish-subscribe event mechanism. Singleton restricts class instantiation to a single shared instance, but carries significant testability tradeoffs.",
        keyInvariants: [
          "Observer pattern decouples state publishers from subscribers, enabling event-driven architecture.",
          "Singleton guarantees exactly one instance per ClassLoader/Process and provides a global access point.",
          "Overusing Singleton introduces hidden global state, memory leaks, and severe unit-testing obstacles.",
        ],
        detailedContent:
          "Observer Pattern:\n- Mechanics: The Subject maintains a collection of Observers. When subject state changes, it iterates over the collection and invokes an `update()` method on each observer.\n- Benefits: Publishers do not know the concrete types or quantities of observers listening to their events.\n- Watchout: Memory leak hazard known as the 'Lapsed Listener Problem'. If an observer registers with a long-lived subject and forgets to unregister, the subject retains a reference to the observer, preventing garbage collection.\n\nSingleton Pattern:\n- Private constructor prevents instantiation via `new`.\n- A static method returns the cached single instance.\n- Thread-safe implementations:\n  1. Eager Initialization: Created at class load time (simple, thread-safe, but consumes memory if never used).\n  2. Double-Checked Locking: Uses `volatile` instance variable and synchronized block (lazy, thread-safe, high performance).\n  3. Bill Pugh Singleton: Uses a private static inner helper class (lazy and thread-safe without synchronization locks).\n  4. Enum Singleton: JVM guarantees single instance and serialization safety.\n\nWhy Singleton is Often an Anti-Pattern:\nSingletons introduce global state, make unit tests order-dependent, and cannot be easily mocked in test suites. Modern architectures prefer managing single instances via Dependency Injection containers (e.g. Spring, Guice) with singleton scope.",
        codeSnippet: {
          language: "java",
          code: `// Bill Pugh Singleton (Lazy & Thread-safe without locks)
public class DatabaseConnectionPool {
    private DatabaseConnectionPool() {
        // Prevent reflection instantiation
        if (Holder.INSTANCE != null) {
            throw new IllegalStateException("Already initialized");
        }
    }

    private static class Holder {
        private static final DatabaseConnectionPool INSTANCE = new DatabaseConnectionPool();
    }

    public static DatabaseConnectionPool getInstance() {
        return Holder.INSTANCE; // Class loaded only when called
    }
}`,
        },
        interviewWatchout:
          "If asked about Double-Checked Locking, always point out that the instance field MUST be declared `volatile` to prevent instruction reordering by the compiler/CPU, which could otherwise expose a half-initialized object to other threads.",
      },
    ],
  },
];

// =========================================================================
// HIGH-YIELD MODULE REVISION SUMMARIES (6 MODULES)
// =========================================================================

export const OOP_REVISE_SECTIONS: ReviseSection[] = [
  {
    title: "1. OOP Foundations & Lifecycle",
    summary:
      "Core transition from procedural separation of data and algorithms to encapsulated objects managing their own state, behavior, and lifecycle in heap memory.",
    bullets: [
      "Procedural separates structs from logic; OOP unifies state and behavior within classes to defend invariants.",
      "A Class is a compile-time metadata blueprint; an Object is a concrete runtime heap allocation with identity, state, and behavior.",
      "Object Identity: '==' tests memory pointer reference; '.equals()' evaluates semantic data equality.",
      "'Tell, Don't Ask': Do not query object state to make decisions externally; instruct the object to perform its own business action.",
      "Creation Sequence: Class load -> heap allocation -> default zeroing -> super() chaining -> constructor body execution.",
      "C++ uses deterministic RAII destructors; Java/C# rely on generational garbage collectors and AutoCloseable blocks.",
    ],
    formulaOrCode:
      "Heap Allocation: Object Header (Mark Word + vptr) + Instance Fields + Alignment Padding",
  },
  {
    title: "2. Encapsulation, Abstraction & Contracts",
    summary:
      "Information hiding protects internal invariants, while behavioral abstraction exposes high-level contracts through abstract classes and interfaces.",
    bullets: [
      "Encapsulation is invariant protection, not merely adding getters and setters. Returning mutable collections leaks private state.",
      "Access Modifier Matrix: private (class only) -> default (package) -> protected (package + subclasses) -> public (world).",
      "Abstraction reduces cognitive load by decoupling client consumption contracts from underlying mechanical implementation details.",
      "Abstract Classes: Single inheritance, partial blueprints, can hold mutable instance fields and constructors for template methods.",
      "Interfaces: Multiple inheritance, pure behavioral contracts, stateless (no instance fields), supports default and static methods.",
    ],
    formulaOrCode:
      "Rule: Favor Interfaces for public contracts across unrelated types; use Abstract Classes for template method code sharing.",
  },
  {
    title: "3. Inheritance, Hierarchy & Object Relationships",
    summary:
      "Classification mechanisms: IS-A inheritance vs HAS-A containment, and distinguishing association, aggregation, and composition lifecycles.",
    bullets: [
      "Inheritance establishes IS-A classification; overusing it causes the Fragile Base Class problem where parent changes break child code.",
      "The Diamond Problem in multiple inheritance produces ambiguous method resolution; solved in C++ via virtual inheritance, and avoided in Java/C# via single class inheritance.",
      "Composition over Inheritance: HAS-A yields looser coupling, higher testability, and runtime behavioral adaptability.",
      "Association: Peer relationship where objects interact independently without ownership (Driver and Car).",
      "Aggregation: Weak 'has-a' where child objects have an independent lifecycle (Department and Professors).",
      "Composition: Strong 'has-a' where child lifecycle is strictly bound to parent (House and Rooms; Order and LineItems).",
    ],
    formulaOrCode:
      "Relationship Strength: Association < Aggregation (hollow diamond) < Composition (filled diamond)",
  },
  {
    title: "4. Polymorphism & Method Binding",
    summary:
      "Subtype, ad-hoc, and parametric polymorphism, dynamic method dispatch via vtables, and type casting mechanics.",
    bullets: [
      "Subtype Polymorphism: Treating different concrete implementations through a unified superclass or interface reference.",
      "Method Overloading: Compile-time polymorphism, same method name, different parameter signatures (early binding).",
      "Method Overriding: Runtime polymorphism, identical signature in subclass, cannot reduce parent visibility (late binding).",
      "Dynamic Dispatch: CPU loads object's header vptr -> indexes class vtable array at fixed offset -> jumps to function pointer in O(1).",
      "Static binding applies to private, static, and final methods because they cannot be overridden (compiler binds directly).",
      "Upcasting is safe and implicit; Downcasting requires runtime checks (`instanceof`) and can throw ClassCastException.",
    ],
    formulaOrCode:
      "Virtual Call: targetAddress = *(objectRef->vptr + methodVtableOffset)",
  },
  {
    title: "5. Critical Class & Object Semantics",
    summary:
      "Execution context with 'this' and 'super', static vs instance memory models, the equals/hashCode contract, and immutability.",
    bullets: [
      "'this' points to the current executing instance; 'super' accesses parent methods and constructor chaining.",
      "Static members belong to the class in Metaspace; instance members reside in the heap per object. Static cannot access 'this'.",
      "The equals/hashCode Contract: If a.equals(b), then a.hashCode() MUST equal b.hashCode() to prevent silent hash collection lookup failures.",
      "Shallow copy duplicates reference addresses; Deep copy recursively clones the entire object graph.",
      "Immutability Recipe: final class, private final fields, no mutators, defensive copies of mutable inputs/outputs, thread-safe by design.",
    ],
    formulaOrCode:
      "HashMap Lookup: bucketIndex = hashCode(key) & (n - 1) -> traverse node chain via equals(key)",
  },
  {
    title: "6. Clean Architecture & Essential Patterns",
    summary:
      "High cohesion, low coupling, the Law of Demeter, the five SOLID principles, and foundational design patterns.",
    bullets: [
      "High Cohesion: A class has one focused architectural purpose. Low Coupling: Modules interact through narrow abstractions.",
      "Law of Demeter: Avoid chained calls like a.getB().getC().doAction(); instruct immediate neighbors directly.",
      "SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.",
      "Factory Pattern: Encapsulates instantiation logic, shielding consumers from concrete classes.",
      "Strategy Pattern: Uses composition over inheritance to swap algorithmic behaviors dynamically at runtime.",
      "Observer Pattern: Decoupled publish-subscribe event dispatch (watch out for lapsed listener memory leaks).",
      "Singleton: Single shared instance, requires volatile in Double-Checked Locking; consider Dependency Injection to avoid global state.",
    ],
    formulaOrCode:
      "DIP Core: High-level policy and low-level details both depend on abstractions (interfaces).",
  },
];

// =========================================================================
// TOP 10 FREQUENTLY ASKED STAFF-LEVEL OOP INTERVIEW QUESTIONS (RECALL MODE)
// =========================================================================

export const OOP_RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: "oop-rec-1",
    question:
      "Explain the Liskov Substitution Principle (LSP) with the classic Square vs Rectangle counter-example. Why does mathematical subtyping fail in OOP?",
    difficulty: "Essential",
    topics: ["LSP", "SOLID", "Inheritance"],
    modelAnswer:
      "The Liskov Substitution Principle states that if S is a subtype of T, objects of type T may be replaced with objects of type S without altering any of the desirable properties of the program (correctness, task performed).\n\nIn mathematics, a Square is a Rectangle (all sides equal). However, in OOP modeling with mutable objects, this IS-A relationship breaks behavioral invariants:\n\nSuppose class `Rectangle` has setters `setWidth(int w)` and `setHeight(int h)`. Client code relies on the postcondition: changing width does not alter height.\nIf `Square extends Rectangle` and overrides `setWidth` to update both width and height to keep them equal, client code written as:\n```java\nvoid testArea(Rectangle r) {\n    r.setWidth(5);\n    r.setHeight(4);\n    assert r.getArea() == 20; // FAILS FOR SQUARE! (Area is 16)\n}\n```\nBecause `Square` strengthens preconditions or violates postconditions of the parent contract, it cannot be substituted for `Rectangle`. The fix is to avoid inheritance and model them as separate classes implementing an immutable `Shape` interface.",
    keyTakeaway:
      "In OOP, IS-A is about BEHAVIORAL COMPATIBILITY, not real-world taxonomic classification. Subtypes must honor all contracts and invariants of the base type.",
  },
  {
    id: "oop-rec-2",
    question:
      "What is the equals() and hashCode() contract, and what exact failure occurs in a HashMap if you override equals() without overriding hashCode()?",
    difficulty: "Essential",
    topics: ["equals & hashCode", "Collections", "Hashing"],
    modelAnswer:
      "The contract specifies three rules:\n1. If `a.equals(b)` is true, `a.hashCode() == b.hashCode()` MUST be true.\n2. If `a.hashCode() == b.hashCode()`, `a.equals(b)` is NOT necessarily true (hash collision).\n3. Consistent: Multiple invocations of `hashCode()` on an unmodified object must return the same integer.\n\nFailure Scenario in a HashMap:\nA `HashMap` organizes entries into an internal array of buckets indexed by `(key.hashCode() ^ (h >>> 16)) & (capacity - 1)`.\nIf you override `equals()` to compare field values (e.g., `userId`), but do NOT override `hashCode()`, the object inherits `Object.hashCode()` which derives from the object's native memory address.\n\nWhen you call `map.put(new User('101'), data)`, it calculates hash code H1 and puts it in Bucket 3.\nWhen you call `map.get(new User('101'))`, the new instance has the exact same `userId` (so `equals()` returns true), but a completely different memory address, generating hash code H2 which maps to Bucket 7!\nThe map looks in Bucket 7, finds nothing, and returns `null`. The stored value is completely unretrievable despite equal keys.",
    keyTakeaway:
      "Overriding equals() without hashCode() causes equal objects to hash to different buckets, silently corrupting HashSet and HashMap lookups.",
  },
  {
    id: "oop-rec-3",
    question:
      "Why should software architects 'Favor Composition Over Inheritance'? Detail three specific architectural hazards caused by deep inheritance hierarchies.",
    difficulty: "Very High",
    topics: ["Composition vs Inheritance", "Coupling", "Architecture"],
    modelAnswer:
      "While inheritance provides convenient code reuse, deep inheritance hierarchies create severe architectural problems:\n\n1. White-Box Reuse & Encapsulation Violation: Subclasses have intimate knowledge of parent internals. Changes in the parent class (e.g. changing an internal method call order) silently break subclass invariants without compiler warnings (The Fragile Base Class problem).\n\n2. Compile-Time Inflexibility: Inheritance is statically bound at compile time. A `SalariedEmployee` cannot dynamically transition into an `HourlyContractor` at runtime without instantiating an entirely new object and migrating state. Composition allows swapping behaviors at runtime via interfaces (e.g., swapping a `PayrollStrategy`).\n\n3. Method Pollution & Invariant Corruption: Subclasses inherit every public method of the parent, including methods that make no sense for the subclass. (e.g., Java's `Stack extends Vector` exposed `insertElementAt()`, breaking LIFO invariants).\n\nComposition provides 'Black-Box' reuse: the host class depends solely on well-defined public interfaces of injected components, yielding loose coupling and simple unit testing.",
    keyTakeaway:
      "Inheritance is compile-time coupling with leaky encapsulation; composition is runtime flexibility with black-box contracts.",
  },
  {
    id: "oop-rec-4",
    question:
      "How does Dynamic Method Dispatch work at the machine and runtime level? Explain Virtual Method Tables (vtables) and vpointers.",
    difficulty: "Very High",
    topics: ["Dynamic Dispatch", "vtable", "Polymorphism"],
    modelAnswer:
      "Dynamic method dispatch is how polymorphic method calls (`baseRef.virtualMethod()`) are resolved to concrete derived implementations at runtime without using expensive `if-else` or `switch` statements.\n\n1. Object Header and vptr:\nWhen a class declares or inherits virtual methods, the compiler adds a hidden pointer (the `vptr`) to the object header of every instance in heap memory. This `vptr` points to the class's Virtual Method Table (`vtable`).\n\n2. The vtable (Virtual Table):\nThe compiler constructs one shared `vtable` per class in read-only metadata memory. The vtable is an array of function pointers. Each virtual method is assigned a fixed index offset across the entire hierarchy (e.g., `makeSound()` is always at index 2).\n\n3. Execution Mechanics:\nWhen `ref.makeSound()` executes:\n- The CPU reads `ref` to find the object address in the heap.\n- It dereferences `vptr` from the object header to find the class vtable.\n- It loads the function pointer at `vtable[2]`.\n- It executes an indirect jump (`CALL`) to that memory address.\n\nThis executes in O(1) constant time with only 2 pointer dereferences.",
    keyTakeaway:
      "Dynamic dispatch trades a single pointer dereference into a compiler-generated function pointer array (vtable) to achieve O(1) polymorphic execution.",
  },
  {
    id: "oop-rec-5",
    question:
      "Explain the Diamond Problem in multiple inheritance and how modern programming languages (C++, Java, Python) resolve or prevent it.",
    difficulty: "High",
    topics: ["Multiple Inheritance", "Diamond Problem", "MRO"],
    modelAnswer:
      "The Diamond Problem occurs when class D inherits from classes B and C, both of which inherit from a common base class A. If B and C both override a method from A, class D faces ambiguity: which implementation does it inherit? Furthermore, does D contain one copy or two duplicate copies of A's fields?\n\nLanguage Resolutions:\n1. Java & C#: Prevent the problem entirely by prohibiting multiple class inheritance. A class can extend only one superclass. Multiple inheritance is allowed only for interfaces (stateless contracts). If two interfaces define conflicting default methods, the compiler forces the child class to explicitly override and resolve the method.\n\n2. C++: Supports multiple inheritance and resolves the diamond problem via Virtual Inheritance (`class B : virtual public A`). This ensures only a single shared instance of base class A is allocated inside D.\n\n3. Python: Uses Method Resolution Order (MRO) calculated via the C3 Linearization algorithm, creating a deterministic, linear search path across parent classes.",
    keyTakeaway:
      "Java and C# prevent the diamond problem by restricting class inheritance to a single tree; C++ uses virtual base classes; Python uses C3 Linearization (MRO).",
  },
  {
    id: "oop-rec-6",
    question:
      "How do you design a strictly immutable class in an object-oriented language, and why is immutability essential in multi-threaded concurrent systems?",
    difficulty: "High",
    topics: ["Immutability", "Concurrency", "Thread Safety"],
    modelAnswer:
      "To design a strictly immutable class:\n1. Declare the class `final` to prevent derived classes from introducing mutable state.\n2. Declare all fields `private` and `final` to ensure one-time initialization.\n3. Provide no setter or mutator methods.\n4. Defensively copy mutable arguments in constructors before assignment (e.g., `this.items = new ArrayList<>(items)`).\n5. Defensively copy or wrap mutable fields in getters (e.g., `return Collections.unmodifiableList(items)`).\n\nConcurrency Importance:\nIn multi-threaded programming, data races occur when two threads concurrently access the same memory location and at least one access is a write. Because immutable objects never change their internal state after construction:\n- Threads can read immutable objects simultaneously without acquiring locks or mutexes.\n- Memory visibility guarantees: In Java and C#, writing to `final` fields establishes a 'happens-before' edge, ensuring all threads see fully initialized state without stale reads.\n- Eliminates lock contention, deadlocks, and cache line ping-ponging.",
    keyTakeaway:
      "Immutable objects are inherently thread-safe without synchronization locks because their state is frozen at construction time.",
  },
  {
    id: "oop-rec-7",
    question:
      "What is the difference between Aggregation and Composition? Give concrete software domain examples and explain lifecycle ownership.",
    difficulty: "Essential",
    topics: ["Aggregation", "Composition", "Object Relationships"],
    modelAnswer:
      "Both Aggregation and Composition represent HAS-A whole-part relationships, but they differ fundamentally in ownership and lifecycle dependency:\n\n1. Composition (Strong Ownership):\n- The whole owns the part, and the part CANNOT exist without the whole.\n- The container is responsible for creating and destroying the child.\n- When the whole is destroyed, all its parts are destroyed (cascading lifecycle).\n- Example: `Order` and `OrderLineItem`. An order line item has no semantic meaning without its parent order. Deleting an Order deletes its items.\n\n2. Aggregation (Weak Ownership):\n- The whole has a reference to the part, but the part CAN exist independently.\n- The part is typically instantiated outside and passed into the whole via constructor injection.\n- When the whole is destroyed, the part continues to exist.\n- Example: `Department` and `Professor`. If a department closes down, the professors do not cease to exist; they are reassigned to other departments.",
    keyTakeaway:
      "Composition is existential ownership (part dies with the whole); Aggregation is temporary association (part survives the whole).",
  },
  {
    id: "oop-rec-8",
    question:
      "Explain the Open/Closed Principle (OCP) and how the Strategy or Factory pattern allows extending system functionality without modifying existing code.",
    difficulty: "High",
    topics: ["OCP", "Strategy Pattern", "Factory Pattern", "SOLID"],
    modelAnswer:
      "The Open/Closed Principle states that software entities (classes, modules, functions) should be open for extension, but closed for modification. You should be able to introduce new business behaviors without altering tested, working code.\n\nViolation Scenario:\nAn `OrderProcessor` containing `if (type == CREDIT_CARD) ... else if (type == PAYPAL) ... else if (type == CRYPTO)`. Every time a new payment provider is integrated, the core `OrderProcessor` must be edited, retested, and redeployed, risking regressions.\n\nRefactoring with Strategy & Factory:\n1. Define an interface: `PaymentStrategy` with method `processPayment(Money amount)`.\n2. Implement concrete strategies: `CreditCardPayment`, `PayPalPayment`, `CryptoPayment`.\n3. The `OrderProcessor` depends strictly on the `PaymentStrategy` abstraction.\n4. When a new payment provider (e.g., Apple Pay) is needed, you write a new class `ApplePayPayment implements PaymentStrategy`. The existing `OrderProcessor` remains 100% untouched and closed for modification.",
    keyTakeaway:
      "OCP shifts architecture from fragile procedural switch statements to polymorphic strategy implementations behind invariant interfaces.",
  },
  {
    id: "oop-rec-9",
    question:
      "Why is the Singleton Pattern often considered an anti-pattern in modern software engineering? Discuss unit testing and concurrency issues.",
    difficulty: "High",
    topics: ["Singleton", "Anti-pattern", "Testing", "Concurrency"],
    modelAnswer:
      "While Singleton ensures a single instance, it causes severe architectural drawbacks in enterprise systems:\n\n1. Hidden Dependencies & Global State: Classes access the singleton directly via `DatabasePool.getInstance()` rather than declaring their dependencies in constructor signatures. This creates invisible coupling across unrelated subsystems.\n\n2. Unit Testing Obstacles: Unit tests must be isolated and repeatable. A singleton introduces shared mutable global state across tests. Test A mutating the singleton causes Test B to fail intermittently, making parallel test execution impossible without cumbersome reflection hacks to reset state.\n\n3. Violates Single Responsibility: The class manages its business logic AND enforces its own lifecycle constraints.\n\n4. Concurrency Bottleneck: Global access to a shared singleton instance often requires synchronization locks, creating contention bottlenecks under high concurrent throughput.\n\nModern Best Practice: Manage singleton lifecycles using Dependency Injection frameworks (Spring, Guice, ASP.NET Core) where classes depend on interfaces and the container manages single-instance scoping.",
    keyTakeaway:
      "Singleton is global state in object-oriented clothing; use Dependency Injection containers to enforce single-instance lifecycles instead.",
  },
  {
    id: "oop-rec-10",
    question:
      "Explain the Law of Demeter (Principle of Least Knowledge). How does 'train wreck' method chaining violate it and how should it be refactored?",
    difficulty: "Very High",
    topics: ["Law of Demeter", "Coupling", "Clean Architecture"],
    modelAnswer:
      "The Law of Demeter states that a unit should have only limited knowledge about other units: only units 'closely related' to the current unit. Informally: 'Only talk to your immediate friends; do not talk to strangers.'\n\nA method M of an object O should only invoke methods on:\n1. Object O itself.\n2. Objects passed as arguments to M.\n3. Objects created/instantiated within M.\n4. Direct instance variables of O.\n\nThe Violation ('Train Wreck' Chaining):\n`customer.getProfile().getAddress().getCity().toUpperCase();`\nHere, the calling code intimately knows that a `Customer` has a `Profile`, a `Profile` has an `Address`, and an `Address` has a `City`. If the schema changes to move `Address` directly to `Customer`, or `Address` is split into billing/shipping, all calling code breaks across the codebase.\n\nRefactoring:\nTell the immediate object to fulfill the requirement: `customer.getCityName()`. The `Customer` delegates internally without exposing its intermediate structural graph. This reduces coupling from 4 distinct classes down to 1.",
    keyTakeaway:
      "Train wreck dot-chains tie your code to external object graphs. Follow Demeter: tell your immediate neighbor what you need rather than navigating its internal components.",
  },
];

