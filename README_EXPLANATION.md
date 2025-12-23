# Angular Ecosystem & Concepts Guide

This guide explains the core concepts used in this project, helping you understand how the pieces fit together and preparing you for future Angular development.

## 1. The Angular Ecosystem

Angular is a platform for building mobile and desktop web applications. It is built around the concept of **Components** and **Services**.

### Components (`.ts`, `.html`, `.css`)
Components are the building blocks of your UI. Each component has:
- **Template (`.html`)**: The view/layout.
- **Logic (`.ts`)**: The behavior (handling clicks, storing data).
- **Styles (`.css`)**: The look and feel.

In our app, `Upload` and `EvaluationResult` are components. They handle what the user *sees* and *does*.

### Signals
We used **Signals** (e.g., `progress = signal(0)`) heavily in this project. Signals are Angular's modern way to handle state. When you update a signal (`this.progress.set(50)`), Angular automatically knows exactly where that value is used in the HTML and updates *only* that part of the DOM. It's faster and cleaner than older methods.

---

## 2. Services & Dependency Injection

**Services** are where your "business logic" lives. They are unrelated to the UI.

### Why use Services?
1.  **Reusability**: You can write the logic once (e.g., `submitJob`) and use it in multiple components.
2.  **Separation of Concerns**: Components should only care about the UI. Services should care about data and APIs.
3.  **Singleton Nature**: By default (`providedIn: 'root'`), a Service is created once and shared across the entire app. This allows you to share state (like a user object) between different pages.

### Example in Project: `JobService`
Instead of writing `http.post(...)` inside the `Upload` component, we put it in `JobService`. This makes the `Upload` component cleaner; it just asks the service to "submit the job" and waits for the result.

---

## 3. Observables (RxJS)

**Observables** are a key part of Angular, powered by the RxJS library. Think of an Observable as a **stream of events** that can arrive over time.

### Key Concepts
-   **Stream**: A pipe that data flows through. It might be one value (an HTTP response) or many values over time (WebSocket messages).
-   **Subscribe**: You must `.subscribe()` to an Observable to "turn on the tap." If you don't subscribe, the request often doesn't even happen.
-   **Observer**: The object that listens to the stream. It usually has `next` (handle data), `error` (handle problems), and `complete` (finished).

### HTTP vs. Observables
Angular's `HttpClient` returns Observables.
```typescript
// We subscribe to the result of the post request
this.http.post(url, data).subscribe({
  next: (response) => console.log('Success!', response),
  error: (err) => console.error('Failed', err)
});
```

---

## 4. WebSockets in Angular

Standard HTTP is **Request -> Response**. You ask for data, the server gives it to you, and the connection closes.
**WebSockets** allow for **Real-Time, Two-Way Communication**. The connection stays open.

### How we used it
In this project, processing a PDF takes time. We didn't want the user to wait for a single long HTTP request (which might time out).

1.  **Frontend**: connect to `ws://.../job_id`.
2.  **Server**: accepts the connection and keeps it open.
3.  **Server**: pushes updates (`"Parsing PDF..."`, `"Progress: 20%"`) whenever it wants.
4.  **Frontend**: listens (`.subscribe()`) and updates the progress bar instantly.

### `WebSocketSubject`
We used RxJS `WebSocketSubject` wrapper. It treats the WebSocket exactly like any other Observable stream.
-   **`webSocket(url)`**: Opens the connection.
-   **`.subscribe(msg => ...)`**: Listens for incoming messages.
-   **`.next(msg)`**: Sends a message to the server (if needed).
-   **`.complete()`**: Closes the connection.

---

## Summary for Next Projects

1.  **Keep Components Small**: Move logic to Services.
2.  **Use Signals for UI State**: Use `signal()` for anything that changes on the screen.
3.  **Master Observables**: Get comfortable with `.subscribe()`. It's how you handle data from APIs, Forms, and Routing.
4.  **Think in Streams**: For real-time apps, stop thinking "Request/Response" and start thinking "Listening for Events" (WebSockets).
