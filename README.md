# joblist-linkedin-adding-bot

A web scraping bot that logs in a job listing url (providing user credentials) and retrieves a list of potential companies, based on open positions (defined by user).
In the next step, the bot logs in the user's Linkedin account, and starts searching for the companies.
For each company, the bot will search for people working at the company with the title "Software Engineer", and will attempt to connect with 4 potential employees, based on mutual connections.
