import express from "express";

export class App {
  private static instance: express.Router;

  static getRoute(): express.Router {
    if (!App.instance) {
      App.instance = express.Router();
    }

    return App.instance;
  }
}
