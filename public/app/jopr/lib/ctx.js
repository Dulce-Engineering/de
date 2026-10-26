import AI from "./AI.js?v=2";
import Db from "./Db.js?v=2";
import Profile from "./Profile.js?v=2";
import Job from "./Job.js?v=2";
import Utils from "../../../lib/Utils.js?v=2";
import Contact from "./Contact.js?v=2";
import Agency from "./Agency.js?v=2";
import Project from "./Project.js?v=2";
import * as fb_app from "firebase/app";
import * as fb_ai from "firebase/ai";
import * as fb_analytics from "firebase/analytics";
import DB_SCHEMA from "../db/schema.js?v=2";
import config from "./config.js?v=2";

/**
 * Truncates a string to a specified maximum length.
 *
 * @param {string|null|undefined} str - The string to truncate.
 * @param {number} max_len - Maximum allowable string length.
 * @returns {string} Truncated string.
 */
function Truncate(str, max_len)
{
  if (!str) return "";
  const s = String(str);
  return s.length <= max_len ? s : s.slice(0, max_len);
}

/**
 * Initializes or retrieves the Firebase App instance.
 *
 * @param {Object} [app_module=fb_app] - The Firebase app module.
 * @returns {Promise<Object|null>} The initialized Firebase App instance or null.
 */
async function Init_Firebase_App(app_module = fb_app)
{
  if (!app_module) return null;

  try
  {
    const apps = app_module.getApps ? app_module.getApps() : [];
    if (apps.length > 0) return app_module.getApp();

    try
    {
      const response = await fetch("/__/firebase/init.json");
      if (response.ok)
      {
        const fb_config = await response.json();
        return app_module.initializeApp(fb_config);
      }
    }
    catch {}

    if (config)
    {
      return app_module.initializeApp(config);
    }
  }
  catch (err)
  {
    console.warn("Init_Firebase_App() warning:", err);
  }

  return null;
}

/**
 * Initializes Firebase Analytics if supported in the current environment.
 *
 * @param {Object|null} app - The initialized Firebase App instance.
 * @param {Object} [analytics_module=fb_analytics] - The Firebase analytics module.
 * @returns {Promise<Object|null>} The Firebase Analytics instance, or null.
 */
async function Init_Firebase_Analytics(app, analytics_module = fb_analytics)
{
  if (!app || !analytics_module) return null;

  try
  {
    const supported = analytics_module.isSupported ? await analytics_module.isSupported() : false;
    if (supported && analytics_module.getAnalytics)
    {
      return analytics_module.getAnalytics(app);
    }
  }
  catch (err)
  {
    console.warn("Init_Firebase_Analytics() warning:", err);
  }

  return null;
}

/**
 * @typedef {Object} ContextRoutes
 * @property {function(number|string, number|string, boolean, string[]): string} gen-cv-2 - Route to CV generator page.
 * @property {function(number|string): string} gen-cl - Route to cover letter generator page.
 * @property {function(): string} profiles - Route to profiles page.
 * @property {function(): string} index - Route to index tracker page.
 */

/**
 * @typedef {Object} Context
 * @property {import("./AI.js").default | null} ai - AI service instance.
 * @property {import("./Db.js").default} db - Main database instance.
 * @property {import("./Db.js").default} db2 - Alias database instance.
 * @property {Object|null} analytics - Firebase Analytics instance.
 * @property {Object} fb_analytics - Firebase Analytics module reference.
 * @property {typeof import("./Agency.js").default} Agency - Agency entity model.
 * @property {typeof import("./Contact.js").default} Contact - Contact entity model.
 * @property {typeof import("./Job.js").default} Job - Job entity model.
 * @property {typeof import("./Profile.js").default} Profile - Profile entity model.
 * @property {typeof import("../../../lib/Utils.js").default} Utils - Shared utilities.
 * @property {typeof import("./Project.js").default} Project - Project entity model.
 * @property {ContextRoutes} routes - Route URL generator functions.
 * @property {function(ErrorEvent|Error|string): Object} On_Error - Error event handler logging uncaught errors to analytics.
 * @property {function(PromiseRejectionEvent|any): Object} On_Unhandled_Rejection - Handler logging unhandled promise rejections to analytics.
 * @property {function(Error|string|any, Object=): Object} Log_Error - Formats and logs error details to Firebase Analytics.
 * @property {function(string, Object=): any} Log_Event - Logs custom events to Firebase Analytics.
 * @property {function(EventTarget=): void} Attach_Error_Handlers - Binds error handlers to a window or target.
 * @property {function(EventTarget=): void} Detach_Error_Handlers - Unbinds error handlers from a window or target.
 */

/**
 * Creates and initializes the application context, including database, AI, Firebase Analytics, models, and error handlers.
 *
 * @param {Object} [options={}] - Optional configuration and dependency overrides for testing.
 * @param {Object} [options.fb_app] - Firebase App module override.
 * @param {Object} [options.fb_ai] - Firebase AI module override.
 * @param {Object} [options.fb_analytics] - Firebase Analytics module override.
 * @param {Object} [options.app] - Pre-initialized Firebase App instance override.
 * @param {Object} [options.analytics] - Pre-initialized Analytics instance override.
 * @param {Object} [options.db] - Db instance override.
 * @param {Object} [options.ai] - AI instance override.
 * @param {boolean} [options.skip_listeners=false] - Whether to skip automatically attaching window error listeners.
 * @returns {Promise<Context>} Initialized application context.
 */
async function New_Ctx(options = {})
{
  const url_params = typeof window !== "undefined" && window.location
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

  const db_id = url_params.get("db_id");
  if (db_id) DB_SCHEMA.name = db_id;

  const app_module = options.fb_app || fb_app;
  const ai_module = options.fb_ai || fb_ai;
  const analytics_module = options.fb_analytics || fb_analytics;

  const app = options.app || await Init_Firebase_App(app_module);
  const analytics = options.analytics !== undefined
    ? options.analytics
    : await Init_Firebase_Analytics(app, analytics_module);

  const ai_instance = options.ai !== undefined
    ? options.ai
    : await AI.New(app_module, ai_module);

  const db_instance = options.db || await Db.New(DB_SCHEMA);

  const ctx =
  {
    ai: ai_instance,
    db: db_instance,
    analytics,
    fb_analytics: analytics_module,
    Agency,
    Contact,
    Job,
    Profile,
    Utils,
    Project,
    routes:
    {
      "gen-cv-2": 
        (job_id, profile_id, gen, ignore_titles) => 
          Add_Params("page/gen-cv-2.html", {job_id, profile_id, gen, ignore_titles, db_id}),
      "gen-cl": job_id => Add_Params("page/gen-cl.html", {job_id, db_id}),
      "profiles": () => Add_Params("page/profiles.html", {db_id}),
      "index": () => Add_Params("index.html", {db_id}),
    },

    /**
     * Logs a custom event to Firebase Analytics.
     *
     * @param {string} event_name - The name of the event to log.
     * @param {Object} [event_params={}] - Parameters associated with the event.
     * @returns {any} Result from analytics.logEvent or null.
     */
    Log_Event(event_name, event_params = {})
    {
      if (ctx.analytics && ctx.fb_analytics?.logEvent)
      {
        try
        {
          return ctx.fb_analytics.logEvent(ctx.analytics, event_name, event_params);
        }
        catch (err)
        {
          console.warn("ctx.Log_Event() error:", err);
        }
      }
      return null;
    },

    /**
     * Formats error information and logs an 'exception' event to Firebase Analytics.
     *
     * @param {Error|string|any} error - The error object or message.
     * @param {Object} [params={}] - Additional parameters (e.g. fatal: boolean).
     * @returns {Object} The formatted event payload.
     */
    Log_Error(error, params = {})
    {
      const message = error?.message || (typeof error === "string" ? error : String(error || "Unknown Error"));
      const stack = error?.stack || null;
      const fatal = params.fatal ?? false;
      const description = stack ? `${message}\n${stack}` : message;

      const event_data =
      {
        description: Truncate(description, 150),
        message: Truncate(message, 100),
        fatal,
        ...params
      };

      ctx.Log_Event("exception", event_data);
      return event_data;
    },

    /**
     * Event handler for uncaught window 'error' events.
     * Logs the error to Firebase Analytics without suppressing default console output.
     *
     * @param {ErrorEvent|Error|string} event - The error event or error object.
     * @returns {Object} The logged event payload.
     */
    On_Error(event)
    {
      const error = event?.error || event;
      const message = error?.message || event?.message || String(error || "Unknown Error");
      const stack = error?.stack || (event?.filename ? `${event.filename}:${event.lineno}:${event.colno || 0}` : null);

      return ctx.Log_Error(error, {
        fatal: true,
        message,
        stack,
        source: "window.onerror"
      });
    },

    /**
     * Event handler for unhandled promise rejection events.
     * Logs the rejection reason to Firebase Analytics without suppressing default console output.
     *
     * @param {PromiseRejectionEvent|any} event - The unhandled rejection event or rejection reason.
     * @returns {Object} The logged event payload.
     */
    On_Unhandled_Rejection(event)
    {
      const reason = event?.reason || event;
      const message = reason?.message || String(reason || "Unhandled Promise Rejection");
      const stack = reason?.stack || null;

      return ctx.Log_Error(reason, {
        fatal: false,
        message,
        stack,
        source: "window.unhandledrejection"
      });
    },

    /**
     * Registers On_Error and On_Unhandled_Rejection listeners on the target object (e.g. window).
     *
     * @param {EventTarget} [target=(typeof window !== "undefined" ? window : null)] - Event target.
     */
    Attach_Error_Handlers(target = (typeof window !== "undefined" ? window : null))
    {
      if (target?.addEventListener)
      {
        target.addEventListener("error", ctx.On_Error);
        target.addEventListener("unhandledrejection", ctx.On_Unhandled_Rejection);
      }
    },

    /**
     * Unregisters On_Error and On_Unhandled_Rejection listeners from the target object.
     *
     * @param {EventTarget} [target=(typeof window !== "undefined" ? window : null)] - Event target.
     */
    Detach_Error_Handlers(target = (typeof window !== "undefined" ? window : null))
    {
      if (target?.removeEventListener)
      {
        target.removeEventListener("error", ctx.On_Error);
        target.removeEventListener("unhandledrejection", ctx.On_Unhandled_Rejection);
      }
    }
  };

  ctx.db2 = ctx.db;

  const db_read_only = url_params.get("db_read_only");
  ctx.db.read_only = db_read_only == "true";

  Utils.Bind(ctx, "On_");

  if (!options.skip_listeners && typeof window !== "undefined")
  {
    ctx.Attach_Error_Handlers(window);
  }

  return ctx;
}

/**
 * Appends URL search parameters to a base URL string.
 *
 * @param {string} url - Target URL path.
 * @param {Object.<string, string|number|boolean>} params - Key-value map of parameters.
 * @returns {string} URL with encoded search parameters.
 */
function Add_Params(url, params)
{
  let res = url;

  if (params)
  {
    let param_sep = "?";
    for (const param_name in params)
    {
      const param_value = params[param_name];
      if (param_value != null && param_value != undefined)
      {
        const param_str = param_sep + param_name + "=" + encodeURIComponent(param_value);
        res += param_str;
        param_sep = "&";
      }
    }
  }

  return res;
}

export default New_Ctx;

