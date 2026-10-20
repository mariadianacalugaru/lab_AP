# Nutriverse

Nutriverse is a web platform that connects patients with nutritionists. Patients can find a nutritionist by location, book appointments, chat, follow a personalised food plan and track their progress. Nutritionists can manage their patients, write food plans and look at patients' measurements. An admin checks nutritionists' certificates and approves or rejects them.

The project was built for the *Laboratory of Advanced Programming* course. It runs as a containerised, load-balanced stack behind an HTTPS reverse proxy.

---

## Architecture

```
                        ┌──────────────────────────────┐
   Browser ──HTTPS──▶   │  nginx (reverse proxy, :443) │
   https://nutriverse   └──────────────┬───────────────┘
                          /            │           /api/*
             ┌────────────┴───┐        │   ┌──────────┴──────────────┐
             │ React frontend │        │   │ Node/Express backend    │
             │ react1, react2 │        │   │ node1, node2, node3     │
             │   (:3000)      │        │   │   (:4000)               │
             └────────────────┘        │   └──────────┬──────────────┘
                                       │              │
                                       │      ┌───────┴───────┐
                                       │      │   MongoDB     │
                                       │      │  (:27017)     │
                                       │      └───────────────┘
```

| Service    | Source                    | Role                                                              |
|------------|---------------------------|-------------------------------------------------------------------|
| `nginx`    | `nutriverse_lab/nginx`    | Ends TLS. Sends `/api/*` to the backend pool and everything else to the frontend pool, balancing load across replicas. |
| `react1/2` | `nutriverse_lab/nutriverse` | React single-page app (Create React App), run by the dev server.  |
| `node1/2/3`| `nutriverse_lab/node`     | Express REST API. Handles sessions (stored in MongoDB), auth with bcrypt, file uploads and e-mail. |
| `mongodb`  | `mongo:latest` image      | Database `nutriverse`. Data is stored in `nutriverse_lab/mongo/datamongo`. |

**External services used by the frontend:** [CometChat](https://www.cometchat.com/) (chat), [Edamam](https://developer.edamam.com/) (nutrition analysis and recipe search) and [CountriesNow](https://countriesnow.space/) (country/city autocomplete).

---

## Repository structure

```
lab_AP/
├── documentazione/            # Project documents: booklet, slides, mockups,
│                              # user stories, Scrum backlog, Function Points, COCOMO II
└── nutriverse_lab/
    ├── docker-compose.yml     # Full stack definition (entry point)
    ├── nginx/                 # Reverse proxy image + nginx.conf
    ├── node/                  # Backend: Express API (web_server.js)
    ├── nutriverse/            # Frontend: React app
    │   ├── public/
    │   └── src/
    │       ├── pages/         # One component per route (+ css/)
    │       ├── component/     # Navbar, search bars, appointment list, …
    │       └── assets/
    ├── mongo/datamongo/       # MongoDB data directory (includes seed data)
    └── ssl/                   # Self-signed development certificate
```

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2 (`docker compose`)
- Free ports: `80`, `443`, `3000`, `3001`, `4000`–`4002`, `27017`

---

## Getting started

### 1. Clone

```bash
git clone https://github.com/mariadianacalugaru/lab_AP.git
cd lab_AP/nutriverse_lab
```

### 2. Map the `nutriverse` hostname

The frontend calls the API at `https://nutriverse/api/...`, so the hostname `nutriverse` must point to your machine:

```bash
# macOS / Linux
echo "127.0.0.1 nutriverse" | sudo tee -a /etc/hosts
```

On Windows, add the same line to `C:\Windows\System32\drivers\etc\hosts`.

### 3. Build and start the stack

```bash
docker compose up --build
```

The first build downloads the images and installs the npm dependencies, so it takes a few minutes. The React dev servers are ready when the logs show `webpack compiled`.

### 4. Open the app

Go to **https://nutriverse**.

The certificate in `ssl/` is self-signed, so the browser shows a warning. Accept it, or click *Advanced → Proceed*, and the site loads.

### Stop / reset

```bash
docker compose down            # stop and remove the containers
docker compose up --build      # rebuild after changing dependencies or Dockerfiles
```

The `src/` folder of the frontend is mounted into the React containers, so edits to the frontend show up without a rebuild. Changes to the backend (`node/`) need `docker compose up --build`.

---

## Features

| Area            | Route(s)                          | Description |
|-----------------|-----------------------------------|-------------|
| Auth            | `/Login`                          | Sign up and log in as a patient or as a nutritionist (nutritionists upload a certificate). |
| Find a nutritionist | `/Nutritionists`              | Search by country and city. |
| Booking         | `/Booking`, `/Appointments`       | See a nutritionist's profile and rating, book a slot, list or cancel appointments. |
| Reviews         | `/reviews`                        | Rate and review a nutritionist. |
| Chat            | `/Chat`                           | Real-time patient ↔ nutritionist chat (CometChat). |
| Food plans      | `/Create_foodplan`, `/MyFoodPlan` | Nutritionists build weekly plans from the food database. Patients view them with nutrition analysis (Edamam). |
| Recipes         | `/Search_recipes`                 | Recipe suggestions (Edamam). |
| Progress        | `/MyProgress`, `/see_progress`    | Patients log body measurements. Nutritionists see them as charts. |
| Patients        | `/MyPatients`                     | A nutritionist's list of patients. |
| Admin           | `/admin`                          | Review certificates and approve or reject nutritionists. |
| Profile         | `/MyProfile`                      | Edit personal data and avatar. |

### MongoDB collections

`users`, `bookings`, `reviews`, `measurements`, `foodplans`, `food`, `chat_history`, `mySessions`.

---

## Configuration notes

This is a course project, so its configuration is **hard-coded for local development**:

| Setting | Where |
|---|---|
| MongoDB credentials (`root` / `example`) | `docker-compose.yml`, `node/web_server.js` |
| Session secret, CORS origins | `node/web_server.js` |
| SMTP account (nodemailer) | `node/web_server.js` |
| CometChat app ID / auth key | `nutriverse/src/pages/Chat.js` |
| Edamam app ID / key | `nutriverse/src/pages/Create_foodplan.js`, `MyFoodPlan.js`, `Search_recipes.js` |
| TLS certificate | `ssl/nutriverse.crt`, `ssl/nutriverse.key` |

Before you deploy this anywhere other than your own machine, move these values into environment variables or a `.env` file (already git-ignored), rotate the keys, and replace the self-signed certificate.

---

## Known limitations

- **Uploads folder:** the backend saves uploaded certificates to `files/` inside the container, but the image does not create that folder. If uploads fail, create it with `mkdir files` in `nutriverse_lab/node/` before building, or add `RUN mkdir -p files` to `node/Dockerfile`.
- **Legacy RabbitMQ endpoint:** `/fetch_messages` connects to RabbitMQ at `amqp://localhost`, which is not part of the current stack. Chat goes through CometChat instead.
- **Seed data:** the `food` collection and the sample data live in the binary MongoDB files under `mongo/datamongo/`. If you start from an empty data directory, food search returns no results.
- `mongo:latest` and `node:latest` are not pinned to a version. If a future image breaks the build, pin them, for example to `mongo:7` and `node:20`.

---

## Project documentation

All project-management material is in [`documentazione/`](documentazione/):

- **Booklet.pdf**: full project report
- **Presentation.pptx**: final presentation
- **mockups.pdf**: UI mockups
- **User Stories.xlsx**, **Nutriverse_Scrum.xlsx**: backlog and sprints
- **Nutriverse_FP.xlsx**, **COCOMO II - Constructive Cost Model.pdf**: effort and size estimation

---

## Authors

Maria Diana Calugaru · Lorenzo Frangella · Elisa De Bellis · Pigiby
