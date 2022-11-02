import { Application, Router } from "express";
import { AdminController } from "../controller/admin-controller";
import { AdminDao } from "../DAO/admin.dao";
import { AdminRoute } from "../route/admin-route";

export class RouteSetup {

    constructor(private expressApp: Application, private router: Router) {}

    public setupRoutes(){
        this.expressApp.use('/api', this.router);

        let adminDao = new AdminDao();

        let adminController = new AdminController(adminDao);
        
        new AdminRoute(this.router, adminController);
    }
}