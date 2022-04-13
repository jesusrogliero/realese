'use strict';

let routes = [
    {path: "/", component: () => import("./components/home.js") },
    {path: "/sold", component: () => import("./components/sold.js") },
];

// exportando rutas designadas
export default routes;