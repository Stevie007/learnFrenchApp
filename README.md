
# Possible next steps
11.11.25 - major release is done. Maybe I leave it as it is. Possible extensions:
- App / user interface
    - in translation result visible to user add a third row with vocabulary
    - recall / repeat: copy a paragraph or word with "one click" into a "remember" list
    - store entry into db
- security ... long list - start with
    - security for backend service (currently open / no security)
    - login / user concept in aws ... what would be the right way
    - WAF / FW / GW for UI AND also for BE services
- automation
    - UI -> "OK" with Apmlify Github trigger on "push"
    - backend

# Deployment
Take care with CORS - configure in Amplify OR in code.

I had a running config running for some hours (CORS in code, not Amplify), 
and 5 min later I received a CORS error.

So I decided for CORS in Amplify and NOT in code. 
If you run into challenges check both, and check http header parameter, 
exactly ONE cors rule should appear, not zero, and not more than one.


# React + Vite - Update

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Repo-Test - ignore this line ;-)