# .Net/C\# Interview Cheat Sheet

# Basic Questions

## What is .NET?

.NET is a framework and runtime developed by Microsoft for building applications. It provides:

* A Common Language Runtime (CLR) for executing code.  
* A Base Class Library (BCL) for common functionality.  
* Support for multiple languages (C\#, VB.NET, F\#, etc.).  
* A unified platform to build web, desktop, cloud, mobile, and IoT applications.

## .NET, Core, & 5/6/7

| Feature | .NET Framework | .NET Core | .NET 5/6/7 (Latest) |
| ----- | ----- | ----- | ----- |
| **Platform** | Windows-only | Cross-platform (Windows, Linux, macOS) | Cross-platform |
| **Performance** | Slower | Faster | Even more optimized |
| **Deployment** | Installed on Windows | Self-contained | Self-contained |
| **Support** | Legacy | Modern | Latest .NET version |
| **Latest Version** | 4.8 (No updates) | 3.1 (End of life) | .NET 7 (Active) |

## Var, Dynamic, & Object

| Type | When Used | Compile-time Check | Runtime Behavior |
| ----- | ----- | ----- | ----- |
| **`var`** | When type is obvious | **Yes** (Strongly typed) | Fixed type after assignment |
| **`dynamic`** | When type is unknown until runtime | **No** | Type checked at runtime |
| **`object`** | When working with any data type | **Yes** (Boxing/unboxing needed) | Can be cast to specific types |

## Value types & Ref types

Value Types:  
Stored on the stack.  
Copies data when assigned.  
Examples: int, double, char, bool, struct, enum.  
Reference Types:  
Stored on the heap.  
Stores a reference (address) to data instead of copying it.  
Examples: class, string, interface, array, delegate.

## Garbage collection

Garbage Collection (GC) automatically frees memory by removing unused objects from the heap.  
GC Process:  
Mark – Identifies objects that are no longer in use.  
Sweep – Removes unused objects.  
Compact – Reorganizes memory to reduce fragmentation.  
Generations in GC:  
Gen 0: Newly allocated objects (frequent collection).  
Gen 1: Short-lived objects that survived Gen 0\.  
Gen 2: Long-lived objects (e.g., static variables, global instances).  
🔹 Forcing GC (not recommended): GC.Collect()

## Access modifiers

| Modifier | Scope |
| ----- | ----- |
| **public** | Accessible **anywhere** |
| **private** | Accessible **only within the same class** |
| **protected** | Accessible in **derived (child) classes** |
| **internal** | Accessible within the **same assembly** |
| **protected internal** | Accessible in **same assembly & derived classes** |
| **private protected** | Accessible in **same class & derived classes within same assembly** |

## Const, readonly, & static

| Keyword | Behavior |
| ----- | ----- |
| **`const`** | Must be assigned **at compile-time**, cannot change. |
| **`readonly`** | Assigned **at runtime** (in constructor), cannot change later. |
| **`static`** | Belongs to the **class, not instance** (shared across all objects). |

## \== vs .Equals()

* \== (Equality Operator) → Compares memory location for reference types, compares values for primitives.  
* .Equals() → Compares actual object values.

## Interface vs abstract class

| Feature | Interface | Abstract Class |
| ----- | ----- | ----- |
| **Method Implementation** | No method implementation (C\# 7 and below) | Can have both abstract & concrete methods |
| **Multiple Inheritance** | Supports multiple interfaces | Only single inheritance |
| **Access Modifiers** | Only **public** members | Can have **private, protected, public** members |
| **Constructors** | No constructors | Can have constructors |

## Extension methods

Extension methods allow you to add new methods to existing classes without modifying their source code.  
Defined as static methods inside a static class.

# Intermediate Questions

## WCF Protocols

\- **HTTP/HTTPS**: BasicHttpBinding, WSHttpBinding, WebHttpBinding (Web services, REST, SOAP)  
\- **TCP**: NetTcpBinding (Fast, secure, Windows-only communication)  
\- **Named Pipes**: NetNamedPipeBinding (Same-machine communication)  
\- **MSMQ**: NetMsmqBinding (Reliable messaging, offline apps)  
\- **UDP**: Custom binding (Lightweight, real-time updates)  
\- **WebSockets**: NetHttpBinding (Full-duplex, real-time apps)

## DI & .NET Core

Dependency Injection (DI) is a design pattern that helps achieve loose coupling by injecting dependencies instead of hardcoding them.  
Types of DI:  
Constructor Injection (most common)  
Method Injection  
Property Injection  
Improves testability, maintainability, and follows the SOLID principle.

## Task & Thread

| Feature | `Task` | `Thread` |
| ----- | ----- | ----- |
| **Definition** | Represents an **asynchronous operation** | Represents a **low-level OS thread** |
| **Creation** | Uses `Task.Run()` | Uses `new Thread()` |
| **Managed by** | .NET Task Scheduler | OS Thread Scheduler |
| **Resource Usage** | More efficient (uses ThreadPool) | Expensive (direct OS thread) |
| **Best for** | **Async operations** (e.g., web requests, DB calls) | **Parallel operations** (e.g., CPU-intensive tasks) |

## Async/Await

async/await enables asynchronous programming in C\#, improving performance by freeing up threads instead of blocking execution.  
Benefits:Avoids blocking the UI.Improves scalability (useful in web apps).

## Delegates & Events

Delegate: A pointer to a method.  
Event: A specialized delegate used for notifications.

## IEnumerable, ICollection, & IList

| Feature | `IEnumerable` | `ICollection` | `IList` |
| ----- | ----- | ----- | ----- |
| **Definition** | Iterates over a collection | Supports count & add/remove | Supports indexing |
| **Can modify?** | ❌ No | ✅ Yes | ✅ Yes |
| **Supports Indexing?** | ❌ No | ❌ No | ✅ Yes |

## SOLID

SOLID is a set of design principles for writing maintainable and scalable code:

| Principle | Description |
| ----- | ----- |
| **S**ingle Responsibility | A class should have only one reason to change |
| **O**pen/Closed | Open for extension, closed for modification |
| **L**iskov Substitution | Subtypes must be substitutable for their base class |
| **I**nterface Segregation | No unnecessary methods in interfaces |
| **D**ependency Inversion | Depend on abstractions, not concrete implementations |

## Ref and Out params

| Feature | `ref` | `out` |
| ----- | ----- | ----- |
| **Initialization required?** | ✅ Yes | ❌ No |
| **Value can be read before assignment?** | ✅ Yes | ❌ No |
| **Used for** | Modifying an existing value | Returning multiple values |

## Lambda & LINQ

Lambda Expressions are concise ways to write anonymous functions.

## Nullable types

Nullable types (?) allow value types to hold null.

## EF Code/DB First

Entity Framework (EF) is an ORM that maps C\# objects to a database.

| Approach | Description |
| ----- | ----- |
| **Code First** | Write C\# classes first, then generate the database |
| **Database First** | Start with an existing database, then generate models |

## HTTP Fetch

Use HttpClient class with Get, Post, etc methods for each HTTP method and can pass StringContent object for data. Can set header properties off HttpClient object.

# Advanced Questions

## Shallow vs Deep Copy

Shallow Copy: Copies the reference of objects within a collection, meaning both the original and the copy refer to the same objects.  
Deep Copy: Creates a new instance of the original object and also recursively copies the objects inside it.  
Manual Copy – You create a new instance and copy properties.  
Serialization-based – You can serialize the object and then deserialize it to create a deep copy (works well with complex objects).

## Memory & generations in GC

Memory Management: .NET uses a Garbage Collector (GC) to handle memory allocation and deallocation automatically. It tracks objects in memory and cleans up those no longer in use.  
Generations in GC:  
Gen 0: Short-lived objects (frequently collected).  
Gen 1: Objects that survived Gen 0 collection.  
Gen 2: Long-lived objects (e.g., static variables).  
LOH (Large Object Heap): Stores large objects (\> 85KB), which are collected less frequently.  
.NET uses these generations to optimize performance. Gen 0 is collected frequently, while Gen 2 and LOH objects are cleaned less often to avoid expensive collections.

## Middleware

Middleware is software that sits in the request pipeline, handling requests and responses before or after they are processed by the application.  
Request Pipeline: The request pipeline is a sequence of middleware components that process HTTP requests and responses. Each middleware can either terminate the request or pass it along to the next middleware in the pipeline.

## Lock, Monitor, & Mutex

lock: A shorthand for Monitor.Enter and Monitor.Exit. It provides mutual exclusion and is used for protecting critical sections from concurrent access.  
Monitor: A low-level synchronization primitive for locking and unlocking code. You can also use Monitor.TryEnter to avoid blocking indefinitely.  
Mutex: A synchronization primitive that can be used across processes, making it suitable for thread synchronization in multi-process environments.

## Dependency Injection

Built-in DI: .NET Core has a built-in dependency injection container that handles object creation and dependency management. When you register services in the container, it uses reflection to instantiate and inject dependencies automatically.  
How It Works: You register services in ConfigureServices in the Startup.cs file.  
The DI container is used to resolve services at runtime.  
The container tracks lifetimes (Transient, Scoped, Singleton).

## Reflection

Reflection is the ability of a program to examine and modify its own structure and behavior at runtime.  
Common Uses of Reflection:  
Inspecting types and members (properties, methods, etc.).  
Creating instances of types dynamically.  
Invoking methods and accessing fields/properties dynamically.

## Tuples vs anon. types

Tuples: A Tuple is a data structure that holds multiple values, often of different types. It’s immutable and can be used for returning multiple values from a method.  
Anonymous Types: Similar to Tuples but typically used to hold data in a lightweight, read-only manner, and they are implicitly typed. Anonymous types cannot be returned as methods.  
Differences:  
Named fields: Tuples can have named fields, but anonymous types have properties with implicit names.  
Immutability: Both are immutable, but anonymous types are more often used for single-purpose scenarios (e.g., LINQ queries).

## Record vs classes

Record Types are a new reference type introduced in C\# 9\. They are immutable by default and provide a concise way to define data structures.  
Differences from Classes:  
Immutability: Record types are immutable by default. You can create a new instance with modified properties using the with keyword.  
Value-based equality: Record types compare their values rather than references, while classes use reference equality.  
Compact syntax for property initialization.

## WPF, Win Forms, UWP

WPF (Windows Presentation Foundation): A framework for building rich desktop applications with advanced UI features (e.g., 2D and 3D graphics, animations, data binding).  
Windows Forms: A lightweight UI framework for building simple Windows desktop applications. Older than WPF, it doesn’t support advanced features like WPF.  
UWP (Universal Windows Platform): A framework for creating cross-platform apps that run on all Windows 10 devices (desktop, mobile, Xbox, etc.).

## Cross-platform

.NET Core is cross-platform, supporting Windows, Linux, and macOS. It achieves this through:  
.NET Runtime (CoreCLR): A platform-agnostic runtime for executing .NET applications.  
CoreFX Libraries: A set of APIs common across platforms.  
Portable Libraries: Code libraries that work across different operating systems.  
.NET Core uses platform-specific implementations for things like file paths, but it abstracts these details using the .NET Standard to ensure compatibility across platforms.

## Scenario-Based & Coding Questions

How would you handle exceptions in a large .NET application?  
How would you implement caching in .NET Core?  
How would you implement a thread-safe Singleton pattern in C\#?  
How would you optimize the performance of a .NET Core web API?  
Explain how JWT authentication works in .NET Core.  
How would you implement a generic repository pattern in Entity Framework?  
Describe a scenario where you would use the Factory design pattern in C\#.

# Web Applications

## Minimal APIs 

## ASP.NET Core Web API (Controller-Based) 

## ASP.NET Core MVC (Model-View-Controller) 

## Blazor 

In EF Core Code-First, you write plain C\# classes (entities) and a database context (DbContext). EF Core inspects these classes and creates or updates your database schema through Migrations.  
1\. Define Entity Models  
By convention, EF Core recognizes a property named Id or \<EntityName\>Id as the primary key. Standard navigation properties establish relationships (such as 1-to-many).  
public class Author  
{  
    public int Id { get; set; }  
    public string Name { get; set; } \= string.Empty;  
    public string Email { get; set; } \= string.Empty;

    // Navigation property: One Author has many Books  
    public List\<Book\> Books { get; set; } \= new();  
}

public class Book  
{  
    public int Id { get; set; }  
    public string Title { get; set; } \= string.Empty;  
    public decimal Price { get; set; }

    // Foreign Key and navigation back to Author  
    public int AuthorId { get; set; }  
    public Author? Author { get; set; }  
}

2\. Create the DbContext  
The DbContext represents a database session. Each DbSet\<T\> maps directly to a database table.  
using Microsoft.EntityFrameworkCore;

public class LibraryContext : DbContext  
{  
    public DbSet\<Author\> Authors \=\> Set\<Author\>();  
    public DbSet\<Book\> Books \=\> Set\<Book\>();

    // Constructor used with Dependency Injection  
    public LibraryContext(DbContextOptions\<LibraryContext\> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)  
    {  
        base.OnModelCreating(modelBuilder);

        // Optional Fluent API: specify precision, lengths, constraints  
        modelBuilder.Entity\<Book\>(entity \=\>  
        {  
            entity.Property(b \=\> b.Title).HasMaxLength(200).IsRequired();  
            entity.Property(b \=\> b.Price).HasPrecision(18, 2);  
        });  
    }  
}

3\. Register with Dependency Injection  
In your ASP.NET Core Program.cs:  
builder.Services.AddDbContext\<LibraryContext\>(options \=\>  
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

4\. Manage Migrations (CLI Commands)  
EF Core creates a snapshot of your model and generates SQL schema migration files.  
\# 1\. Install EF CLI tools if not already present  
dotnet tool install \--global dotnet-ef

\# 2\. Add required NuGet packages to your project  
dotnet add package Microsoft.EntityFrameworkCore.SqlServer  
dotnet add package Microsoft.EntityFrameworkCore.Design

\# 3\. Create an initial migration  
dotnet ef migrations add InitialCreate

\# 4\. Apply migrations to update the target database (dev environment)  
dotnet ef database update

5\. Basic CRUD Operations  
public class BookService  
{  
    private readonly LibraryContext \_context;

    public BookService(LibraryContext context)  
    {  
        \_context \= context;  
    }

    // CREATE  
    public async Task AddBookAsync(string title, decimal price, int authorId)  
    {  
        var book \= new Book  
        {  
            Title \= title,  
            Price \= price,  
            AuthorId \= authorId  
        };

        \_context.Books.Add(book);  
        await \_context.SaveChangesAsync(); // Generates and runs INSERT  
    }

    // READ (with related data & AsNoTracking for read-only speed)  
    public async Task\<List\<Book\>\> GetBooksByAuthorAsync(int authorId)  
    {  
        return await \_context.Books  
            .AsNoTracking()  
            .Include(b \=\> b.Author)       // SQL JOIN  
            .Where(b \=\> b.AuthorId \== authorId)  
            .ToListAsync();  
    }

    // UPDATE  
    public async Task UpdatePriceAsync(int bookId, decimal newPrice)  
    {  
        var book \= await \_context.Books.FindAsync(bookId);  
        if (book \!= null)  
        {  
            book.Price \= newPrice;  
            await \_context.SaveChangesAsync(); // Generates and runs UPDATE only for changed columns  
        }  
    }

    // DELETE  
    public async Task DeleteBookAsync(int bookId)  
    {  
        var book \= await \_context.Books.FindAsync(bookId);  
        if (book \!= null)  
        {  
            \_context.Books.Remove(book);  
            await \_context.SaveChangesAsync(); // Generates and runs DELETE  
        }  
    }  
}

Key Conventions to Mention in Interviews  
 \* PrimaryKey Detection: By default, EF Core designates Id or \<EntityName\>Id as an auto-incrementing identity primary key.  
 \* Foreign Key Detection: Any property matching \<NavigationProperty\>Id (like AuthorId when Author exists) is inferred as a foreign key.  
 \* Change Tracker: EF Core keeps internal snapshots of loaded entities. Calling .SaveChangesAsync() compares the current state to the snapshot and produces targeted DML commands (INSERT, UPDATE, DELETE).  
