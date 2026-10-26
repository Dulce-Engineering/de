import assert from 'node:assert/strict';
import { test } from 'node:test';
import New_Ctx from '../../../public/app/jopr/lib/ctx.js';

test('New_Ctx()', Test_New_Ctx);
test('ctx.Log_Event()', Test_Log_Event);
test('ctx.Log_Error()', Test_Log_Error);
test('ctx.On_Error()', Test_On_Error);
test('ctx.On_Unhandled_Rejection()', Test_On_Unhandled_Rejection);
test('ctx.Attach_Error_Handlers()', Test_Attach_Error_Handlers);
test('ctx.Detach_Error_Handlers()', Test_Detach_Error_Handlers);

/**
 * Creates a mock test environment for testing context logic without live services.
 *
 * @param {Object} [overrides={}] - Service overrides.
 * @returns {Promise<import('../../../public/app/jopr/lib/ctx.js').Context>}
 */
async function Create_Test_Ctx(overrides = {})
{
  const mock_events = [];
  const mock_analytics_module = {
    isSupported: async () => true,
    getAnalytics: (app) => ({ app, id: 'test_analytics' }),
    logEvent: (analytics, name, params) => {
      mock_events.push({ name, params });
      return { name, params };
    }
  };

  const mock_app_module = {
    getApps: () => [{ name: '[DEFAULT]' }],
    getApp: () => ({ name: '[DEFAULT]' }),
    initializeApp: (cfg) => ({ name: '[DEFAULT]', cfg })
  };

  const mock_ai_module = {
    GoogleAIBackend: class {},
    getAI: () => ({})
  };

  const mock_db = {
    name: 'MockDB',
    read_only: false
  };

  const ctx = await New_Ctx({
    fb_app: mock_app_module,
    fb_ai: mock_ai_module,
    fb_analytics: mock_analytics_module,
    db: mock_db,
    ai: null,
    skip_listeners: true,
    ...overrides
  });

  ctx._mock_events = mock_events;
  return ctx;
}

async function Test_New_Ctx()
{
  // Scenario 1: Standard context creation
  {
    const ctx = await Create_Test_Ctx();

    assert.ok(ctx, 'Context should be created');
    assert.ok(ctx.db, 'Context should contain db');
    assert.strictEqual(ctx.db2, ctx.db, 'db2 should alias db');
    assert.ok(ctx.analytics, 'Context should contain initialized analytics');
    assert.ok(ctx.fb_analytics, 'Context should contain fb_analytics module reference');
    assert.ok(ctx.Agency, 'Context should contain Agency model');
    assert.ok(ctx.Contact, 'Context should contain Contact model');
    assert.ok(ctx.Job, 'Context should contain Job model');
    assert.ok(ctx.Profile, 'Context should contain Profile model');
    assert.ok(ctx.Project, 'Context should contain Project model');
    assert.ok(ctx.Utils, 'Context should contain Utils');
    assert.strictEqual(typeof ctx.On_Error, 'function');
    assert.strictEqual(typeof ctx.On_Unhandled_Rejection, 'function');
    assert.strictEqual(typeof ctx.Log_Error, 'function');
    assert.strictEqual(typeof ctx.Log_Event, 'function');
  }

  // Scenario 2: Route helpers
  {
    const ctx = await Create_Test_Ctx();
    const cv_url = ctx.routes['gen-cv-2'](10, 20, true, ['Dev']);
    assert.ok(cv_url.includes('page/gen-cv-2.html'));
    assert.ok(cv_url.includes('job_id=10'));
    assert.ok(cv_url.includes('profile_id=20'));

    const cl_url = ctx.routes['gen-cl'](15);
    assert.ok(cl_url.includes('page/gen-cl.html'));
    assert.ok(cl_url.includes('job_id=15'));

    const profiles_url = ctx.routes['profiles']();
    assert.ok(profiles_url.includes('page/profiles.html'));

    const index_url = ctx.routes['index']();
    assert.ok(index_url.includes('index.html'));
  }

  // Scenario 3: Analytics initialization when not supported
  {
    const unsupported_analytics = {
      isSupported: async () => false,
      getAnalytics: () => ({})
    };

    const ctx = await Create_Test_Ctx({
      fb_analytics: unsupported_analytics,
      analytics: undefined
    });

    assert.strictEqual(ctx.analytics, null, 'Analytics should be null when unsupported');
  }
}

async function Test_Log_Event()
{
  // Scenario 1: Successful event logging with active analytics
  {
    const ctx = await Create_Test_Ctx();
    const result = ctx.Log_Event('user_signup', { method: 'google' });

    assert.ok(result);
    assert.strictEqual(ctx._mock_events.length, 1);
    assert.strictEqual(ctx._mock_events[0].name, 'user_signup');
    assert.deepStrictEqual(ctx._mock_events[0].params, { method: 'google' });
  }

  // Scenario 2: When analytics is disabled/null, does not throw and returns null
  {
    const ctx = await Create_Test_Ctx({ analytics: null });
    const result = ctx.Log_Event('test_event', { key: 'value' });

    assert.strictEqual(result, null);
    assert.strictEqual(ctx._mock_events.length, 0);
  }

  // Scenario 3: When logEvent throws, catches error and returns null
  {
    const throwing_analytics = {
      logEvent: () => {
        throw new Error('Analytics quota exceeded');
      }
    };
    const ctx = await Create_Test_Ctx({
      analytics: { active: true },
      fb_analytics: throwing_analytics
    });

    const result = ctx.Log_Event('failing_event', {});
    assert.strictEqual(result, null);
  }
}

async function Test_Log_Error()
{
  // Scenario 1: Logging an Error instance with stack trace
  {
    const ctx = await Create_Test_Ctx();
    const error = new Error('Database connection failed');
    error.stack = 'Error: Database connection failed\n    at Connect (db.js:10:5)';

    const payload = ctx.Log_Error(error, { fatal: true, component: 'Db' });

    assert.strictEqual(payload.message, 'Database connection failed');
    assert.strictEqual(payload.fatal, true);
    assert.strictEqual(payload.component, 'Db');
    assert.ok(payload.description.includes('Database connection failed'));
    assert.ok(payload.description.includes('db.js:10:5'));

    assert.strictEqual(ctx._mock_events.length, 1);
    assert.strictEqual(ctx._mock_events[0].name, 'exception');
    assert.strictEqual(ctx._mock_events[0].params.message, 'Database connection failed');
    assert.strictEqual(ctx._mock_events[0].params.fatal, true);
  }

  // Scenario 2: Logging a string message without stack
  {
    const ctx = await Create_Test_Ctx();
    const payload = ctx.Log_Error('Failed to fetch user profile');

    assert.strictEqual(payload.message, 'Failed to fetch user profile');
    assert.strictEqual(payload.fatal, false);
    assert.strictEqual(payload.description, 'Failed to fetch user profile');
  }

  // Scenario 3: Truncation of extremely long error descriptions to respect GA4 limits
  {
    const ctx = await Create_Test_Ctx();
    const huge_message = 'A'.repeat(300);
    const huge_error = new Error(huge_message);

    const payload = ctx.Log_Error(huge_error);

    assert.ok(payload.message.length <= 100, 'Message should be truncated to 100 chars');
    assert.ok(payload.description.length <= 150, 'Description should be truncated to 150 chars');
  }
}

async function Test_On_Error()
{
  // Scenario 1: Standard ErrorEvent object
  {
    const ctx = await Create_Test_Ctx();
    let default_prevented = false;

    const mock_error_event = {
      error: new Error('ReferenceError: x is not defined'),
      message: 'Uncaught ReferenceError: x is not defined',
      filename: 'http://localhost/app.js',
      lineno: 42,
      colno: 12,
      preventDefault: () => { default_prevented = true; }
    };

    const payload = ctx.On_Error(mock_error_event);

    assert.strictEqual(payload.fatal, true);
    assert.strictEqual(payload.source, 'window.onerror');
    assert.strictEqual(payload.message, 'ReferenceError: x is not defined');
    assert.ok(!default_prevented, 'Must not call preventDefault so console output is preserved');

    assert.strictEqual(ctx._mock_events.length, 1);
    assert.strictEqual(ctx._mock_events[0].name, 'exception');
  }

  // Scenario 2: Event without error object (e.g. script loading error)
  {
    const ctx = await Create_Test_Ctx();
    const mock_event = {
      message: 'Script error.',
      filename: 'http://cdn.com/lib.js',
      lineno: 1,
      colno: 1
    };

    const payload = ctx.On_Error(mock_event);

    assert.strictEqual(payload.fatal, true);
    assert.strictEqual(payload.message, 'Script error.');
    assert.strictEqual(payload.stack, 'http://cdn.com/lib.js:1:1');
  }
}

async function Test_On_Unhandled_Rejection()
{
  // Scenario 1: Promise rejection with Error instance
  {
    const ctx = await Create_Test_Ctx();
    let default_prevented = false;

    const mock_rejection_event = {
      reason: new Error('Network timeout'),
      preventDefault: () => { default_prevented = true; }
    };

    const payload = ctx.On_Unhandled_Rejection(mock_rejection_event);

    assert.strictEqual(payload.fatal, false);
    assert.strictEqual(payload.source, 'window.unhandledrejection');
    assert.strictEqual(payload.message, 'Network timeout');
    assert.ok(!default_prevented, 'Must not call preventDefault so console output is preserved');

    assert.strictEqual(ctx._mock_events.length, 1);
    assert.strictEqual(ctx._mock_events[0].name, 'exception');
  }

  // Scenario 2: Promise rejection with string reason
  {
    const ctx = await Create_Test_Ctx();
    const mock_rejection_event = {
      reason: 'Unauthorized access'
    };

    const payload = ctx.On_Unhandled_Rejection(mock_rejection_event);

    assert.strictEqual(payload.fatal, false);
    assert.strictEqual(payload.message, 'Unauthorized access');
  }
}

async function Test_Attach_Error_Handlers()
{
  // Scenario 1: Successfully attaching listeners to mock window target
  {
    const ctx = await Create_Test_Ctx();
    const listeners = {};
    const mock_target = {
      addEventListener: (type, fn) => {
        listeners[type] = fn;
      }
    };

    ctx.Attach_Error_Handlers(mock_target);

    assert.strictEqual(listeners['error'], ctx.On_Error);
    assert.strictEqual(listeners['unhandledrejection'], ctx.On_Unhandled_Rejection);
  }

  // Scenario 2: Null target handled safely
  {
    const ctx = await Create_Test_Ctx();
    assert.doesNotThrow(() => {
      ctx.Attach_Error_Handlers(null);
    });
  }
}

async function Test_Detach_Error_Handlers()
{
  // Scenario 1: Successfully detaching listeners from mock window target
  {
    const ctx = await Create_Test_Ctx();
    const removed = {};
    const mock_target = {
      removeEventListener: (type, fn) => {
        removed[type] = fn;
      }
    };

    ctx.Detach_Error_Handlers(mock_target);

    assert.strictEqual(removed['error'], ctx.On_Error);
    assert.strictEqual(removed['unhandledrejection'], ctx.On_Unhandled_Rejection);
  }

  // Scenario 2: Null target handled safely
  {
    const ctx = await Create_Test_Ctx();
    assert.doesNotThrow(() => {
      ctx.Detach_Error_Handlers(null);
    });
  }
}
