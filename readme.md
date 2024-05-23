# URL shortner

- Design a URL Shortner services that takes a valid URL and returns a shortned URL, redirecting the user to the previously given URL.
- Also keep track of total number of visits/clicks on the URL link.

# Routes

- POST /URL -> Genetrates the new short URL and returns the shortned URL in the format domain/id.

- GET /:id -> Redirects the user to the original URL.

- GET /URL/analytics/:id -> Returns the number of clicks for the provided URL