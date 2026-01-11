import { type Request, type Response, type NextFunction } from "express";

// Global Middleware to make "user" available to all EJS templates
export function globals(req: Request, res: Response, next: NextFunction) {
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.url;

  const flash = req.flash();
  if (flash !== undefined && (flash["success"] || flash["error"] || flash["info"])) {
    res.locals.messages = {
      success: flash["success"],
      error: flash["error"],
      info: flash["info"],
    };
  }

  return next();
}

// Middleware to check if user is logged in
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) return res.redirect("/login");

  return next();
}
