# Product Requirements Document (PRD): Project Match Platform

## 1. Product Overview
**Project Match** is a web-based platform designed to connect ambitious **Students** with **Recruiters** (Organizations, Startups, and Professors) for short-term, project-based opportunities. The platform acts as a bridge, allowing students to gain real-world experience while enabling recruiters to find specialized talent quickly and efficiently without the commitment of full-time hiring.

---

## 2. Target Audience & User Needs

### 2.1 Students
**Primary Users:** Undergraduate and graduate students seeking practical experience across domains like Software Engineering, Mechanical Engineering, Marketing, Design, Product Management, and Data Science.
**Needs & Pain Points:**
- **Experience Gap:** Need real-world projects to build resumes and portfolios.
- **Financial Support:** Seeking stipends (remuneration) to support their education.
- **Skill Alignment:** Difficulty finding projects that match their specific tech stack or skill set (e.g., React, Ansys, Python).
- **Transparency:** Need clear visibility into application status and direct communication channels with recruiters.

### 2.2 Recruiters (Organizations / Professors)
**Primary Users:** HR professionals, startup founders, and academic researchers seeking talent for specific objectives.
**Needs & Pain Points:**
- **Agile Hiring:** Need to quickly onboard talent for short-term tasks or specialized projects.
- **Cost Efficiency:** Prefer project-based stipends over full-time salaries for limited-scope work.
- **Quality Assurance:** Need to evaluate candidates based on past projects, domain expertise, and references.
- **Pipeline Management:** Require an easy way to track candidates from application to project completion, including issuing official documents (e.g., Letters of Recommendation, Completion Certificates).

---

## 3. User Personas

### Persona 1: Alex the Aspiring Developer (Student)
- **Background:** Junior CS major. Has built personal projects but lacks enterprise experience.
- **Goal:** Find a 2-month remote backend engineering project that pays a stipend and provides a letter of recommendation.
- **Behavior:** Logs in, filters projects by "Software Engineering" and tags like "Node.js", applies to matching projects, and tracks application status on the dashboard.

### Persona 2: Sarah the Startup Founder (Recruiter)
- **Background:** Founder of an early-stage FinTech startup. Limited budget, needs a specific MVP feature built.
- **Goal:** Hire 2 frontend engineering interns for a 4-week sprint.
- **Behavior:** Posts a project specifying duration, remuneration, and required skills. Reviews incoming applications, messages top candidates directly, and eventually marks them as "Selected".

---

## 4. Core Features & Requirements

### 4.1 Authentication & Profile Management
- **Role-Based Routing:** Users explicitly sign up/log in as either a *Student* or *Recruiter*.
- **Student Profile Setup:** Mandatory onboarding flow for students to outline their college, core domain, skills, and past projects before they can apply.

### 4.2 Recruiter Interactions
- **Project Posting:** Recruiters can create projects defining Title, Duration, Domain/Category, Tags, Remuneration, and Total Positions.
- **Candidate Pipeline (Applicant Tracking):** 
  - View all applicants for a specific project.
  - Actions: *Accept*, *Decline*, *Revert* candidates.
- **Direct Messaging:** Built-in messaging hub to interview and communicate with selected/working candidates.
- **Document Issuance:** Automatically generate and send official letters (Joining Letters, Completion Certificates, Discovery Letters) to students.
- **Project Lifecycle:** Archive projects once all positions are filled or the project timeline concludes.

### 4.3 Student Interactions
- **Project Discovery:** Browse a feed of live projects, search by keywords, and filter by categories/domains.
- **Application Flow:** Apply to projects directly. (Waitlist or apply mechanism).
- **Dashboard Tracking:** View active applications, archived applications (rejected), and ongoing projects.
- **Messaging Hub:** Responsive chat interface to communicate with recruiters regarding active applications.
- **Completed Projects Portfolio:** Automatically tracks and displays successfully finished projects and earned stipends.

---

## 5. Key Data Models (High-Level)

### 5.1 Project Entity
- `id`: Unique Identifier
- `title`: Name of the opportunity
- `company / recruiter`: Organization name
- `duration`: e.g., "2 Months", "4 Weeks"
- `type`: e.g., "Remote", "On-site"
- `category / domain`: e.g., "Software Engineering", "Marketing"
- `tags`: Array of skills (e.g., `["React", "Node.js"]`)
- `remuneration`: Stipend amount (can be 0 for purely experience-based)
- `totalPositions` & `hiredPositions`: Capacity tracking
- `status`: Active, Completed, Archived

### 5.2 Student Profile Entity
- `id`, `name`, `photoUrl`: Basic info
- `college`: Institutional affiliation
- `domain`: Primary area of study/work
- `completedProjects`: Integer tracking success rate
- `pastProjects`: Array of past experiences (Title, Company, Duration, Domain)

---

## 6. Success Metrics (KPIs)
- **Liquidity:** Number of active projects vs. number of active students.
- **Placement Rate:** Percentage of posted projects that successfully hire at least one student.
- **Engagement:** Average messages exchanged per application.
- **Completion Rate:** Percentage of hired students who successfully finish the project and receive a completion letter.
