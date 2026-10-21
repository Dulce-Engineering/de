import assert from 'node:assert/strict';
import { test } from 'node:test';
import Profile from '../../../public/app/jopr/lib/Profile.js';

test('Profile.Copy()', Test_Copy);

async function Test_Copy()
{
  // Scenario 1: Standard copy with career and education records
  {
    const initial_data = Get_Test_Fixture_Data();
    const ctx = Create_Mock_Ctx(initial_data);

    const orig_profile_id = 1;
    const new_profile_id = await Profile.Copy(ctx, orig_profile_id);

    assert.ok(new_profile_id, 'Copy should return a valid new profile ID');
    assert.notStrictEqual(new_profile_id, orig_profile_id, 'New profile ID must be distinct from original');

    const copied_profile = await Profile.Select_By_Id(ctx, new_profile_id);
    assert.ok(copied_profile, 'Copied profile must exist in the database');
    assert.strictEqual(copied_profile.title, 'Copy of Full Stack Developer', 'Title should be prefixed with "Copy of "');
    assert.strictEqual(copied_profile.active, false, 'Copied profile should not be active');
    assert.strictEqual(copied_profile.name, 'Alice Smith', 'Name should be preserved');
    assert.strictEqual(copied_profile.email, 'alice@example.com', 'Email should be preserved');
    assert.strictEqual(copied_profile.phone, '0400000000', 'Phone should be preserved');
    assert.strictEqual(copied_profile.address, '123 Main St', 'Address should be preserved');
    assert.strictEqual(copied_profile.url, 'https://alice.example.com', 'URL should be preserved');
    assert.strictEqual(copied_profile.residency_status, 'Citizen', 'Residency status should be preserved');
    assert.strictEqual(copied_profile.seek_url, 'https://seek.com/alice', 'Seek URL should be preserved');
    assert.strictEqual(copied_profile.linkedin_url, 'https://linkedin.com/in/alice', 'LinkedIn URL should be preserved');

    assert.deepStrictEqual(copied_profile.personal_summary, initial_data.profiles[0].personal_summary);
    assert.deepStrictEqual(copied_profile.skills, initial_data.profiles[0].skills);
    assert.deepStrictEqual(copied_profile.interests, initial_data.profiles[0].interests);

    // Verify arrays are cloned and not shared by reference
    const orig_profile = await Profile.Select_By_Id(ctx, orig_profile_id);
    assert.strictEqual(orig_profile.active, true, 'Original profile must remain active');

    // Verify career jobs duplication
    const copied_jobs = await Profile.Job_Select(ctx, j => j.profile_id == new_profile_id);
    assert.strictEqual(copied_jobs.length, 2, 'Should copy exactly 2 career jobs belonging to profile 1');
    assert.ok(copied_jobs.every(j => j.profile_id == new_profile_id && j.id != 101 && j.id != 102), 'Copied jobs must have new IDs and point to new profile');
    const tech_corp_job = copied_jobs.find(j => j.company_name === 'Tech Corp');
    assert.ok(tech_corp_job, 'Tech Corp job should be copied');
    assert.strictEqual(tech_corp_job.role_titles, 'Senior Software Engineer');
    assert.strictEqual(tech_corp_job.tech, 'JavaScript, C#');

    // Verify education records duplication
    const copied_edus = await Profile.Edu_Select(ctx, e => e.profile_id == new_profile_id);
    assert.strictEqual(copied_edus.length, 1, 'Should copy exactly 1 education record belonging to profile 1');
    assert.ok(copied_edus.every(e => e.profile_id == new_profile_id && e.id != 201), 'Copied education must have a new ID and point to new profile');
    assert.strictEqual(copied_edus[0].title, 'BSc Computer Science');
    assert.strictEqual(copied_edus[0].institution, 'University of Sydney');

    // Verify unrelated profile data is untouched
    const other_profile_jobs = await Profile.Job_Select(ctx, j => j.profile_id == 2);
    assert.strictEqual(other_profile_jobs.length, 1, 'Profile 2 jobs should remain unaffected');
    const other_profile_edus = await Profile.Edu_Select(ctx, e => e.profile_id == 2);
    assert.strictEqual(other_profile_edus.length, 1, 'Profile 2 education should remain unaffected');
  }

  // Scenario 2: Fallback title when original profile title is null/empty
  {
    const fixture = {
      profiles: [
        { id: 10, title: null, name: 'Bob Roberts', active: true },
        { id: 20, title: '', name: null, active: false }
      ],
      career: [],
      education: []
    };
    const ctx = Create_Mock_Ctx(fixture);

    const bob_copy_id = await Profile.Copy(ctx, 10);
    const bob_copy = await Profile.Select_By_Id(ctx, bob_copy_id);
    assert.strictEqual(bob_copy.title, 'Copy of Bob Roberts', 'Fallback to profile name if title is null');

    const untitled_copy_id = await Profile.Copy(ctx, 20);
    const untitled_copy = await Profile.Select_By_Id(ctx, untitled_copy_id);
    assert.strictEqual(untitled_copy.title, 'Copy of Untitled Profile', 'Fallback to Untitled Profile if title and name are missing');
  }

  // Scenario 3: Copying a non-existent profile returns null
  {
    const ctx = Create_Mock_Ctx({ profiles: [], career: [], education: [] });
    const result = await Profile.Copy(ctx, 99999);
    assert.strictEqual(result, null, 'Copying non-existent profile ID should return null');
  }

  // Scenario 4: Copying a profile with no career and no education records
  {
    const fixture = {
      profiles: [{ id: 5, title: 'Blank Slate', name: 'Fresh User', active: true }],
      career: [],
      education: []
    };
    const ctx = Create_Mock_Ctx(fixture);

    const copied_id = await Profile.Copy(ctx, 5);
    assert.ok(copied_id, 'Profile copy without jobs or education should succeed');
    const copied = await Profile.Select_By_Id(ctx, copied_id);
    assert.strictEqual(copied.title, 'Copy of Blank Slate');

    const jobs = await Profile.Job_Select(ctx, j => j.profile_id == copied_id);
    assert.strictEqual(jobs.length, 0);
    const edus = await Profile.Edu_Select(ctx, e => e.profile_id == copied_id);
    assert.strictEqual(edus.length, 0);
  }

  // Scenario 5: Database save failure handling
  {
    const ctx = Create_Mock_Ctx({
      profiles: [{ id: 1, title: 'Test Profile', active: true }],
      career: [],
      education: []
    });
    // Simulate database save failure
    ctx.db.Save = async () => null;

    const result = await Profile.Copy(ctx, 1);
    assert.strictEqual(result, null, 'Should return null if saving the cloned profile fails');
  }
}

function Get_Test_Fixture_Data()
{
  return {
    profiles: [
      {
        id: 1,
        title: 'Full Stack Developer',
        active: true,
        name: 'Alice Smith',
        email: 'alice@example.com',
        phone: '0400000000',
        address: '123 Main St',
        url: 'https://alice.example.com',
        residency_status: 'Citizen',
        seek_url: 'https://seek.com/alice',
        linkedin_url: 'https://linkedin.com/in/alice',
        personal_summary: ['Passionate software engineer', '10+ years experience'],
        skills: ['JavaScript', 'HTML5', 'CSS3', 'Node.js'],
        interests: ['Photography', 'Running']
      },
      {
        id: 2,
        title: 'Data Scientist',
        active: false,
        name: 'David Data',
        email: 'david@example.com'
      }
    ],
    career: [
      {
        id: 101,
        profile_id: 1,
        company_name: 'Tech Corp',
        role_titles: 'Senior Software Engineer',
        work_type: 'full-time',
        location: 'Sydney',
        tech: 'JavaScript, C#',
        responsibilities: 'Lead architecture',
        projects: 'PWA migration',
        start_date: 1600000000000,
        end_date: 1700000000000
      },
      {
        id: 102,
        profile_id: 1,
        company_name: 'Startup Inc',
        role_titles: 'Frontend Engineer',
        work_type: 'contract',
        location: 'Remote',
        tech: 'React, TypeScript',
        responsibilities: 'UI components',
        projects: 'Dashboard rewrite',
        start_date: 1500000000000,
        end_date: 1599999999000
      },
      {
        id: 103,
        profile_id: 2,
        company_name: 'Analytics Co',
        role_titles: 'Data Analyst',
        work_type: 'full-time',
        location: 'Melbourne',
        tech: 'Python, SQL',
        responsibilities: 'Data modeling',
        projects: 'BI dashboards',
        start_date: 1610000000000,
        end_date: null
      }
    ],
    education: [
      {
        id: 201,
        profile_id: 1,
        title: 'BSc Computer Science',
        institution: 'University of Sydney',
        year: 2015
      },
      {
        id: 202,
        profile_id: 2,
        title: 'MSc Statistics',
        institution: 'University of Melbourne',
        year: 2018
      }
    ]
  };
}

function Create_Mock_Db(initial_records = {})
{
  let next_id = 500;
  const store = {
    profiles: JSON.parse(JSON.stringify(initial_records.profiles || [])),
    career: JSON.parse(JSON.stringify(initial_records.career || [])),
    education: JSON.parse(JSON.stringify(initial_records.education || []))
  };

  return {
    store,
    async Select_By_Id(table_name, id)
    {
      const items = store[table_name] || [];
      const found = items.find(item => item.id == id);
      return found ? JSON.parse(JSON.stringify(found)) : null;
    },
    async Select(table_name, where_fn, order_by_fn)
    {
      const items = store[table_name] || [];
      let result = where_fn ? items.filter(where_fn) : [...items];
      if (order_by_fn)
      {
        result.sort(order_by_fn);
      }
      return JSON.parse(JSON.stringify(result));
    },
    async Select_First(table_name, where_fn)
    {
      const items = store[table_name] || [];
      const found = where_fn ? items.find(where_fn) : items[0];
      return found ? JSON.parse(JSON.stringify(found)) : null;
    },
    async Save(table_name, item)
    {
      if (!store[table_name]) store[table_name] = [];
      const copy = JSON.parse(JSON.stringify(item));
      if (copy.id != null && copy.id != undefined)
      {
        const index = store[table_name].findIndex(i => i.id == copy.id);
        if (index >= 0)
        {
          store[table_name][index] = copy;
          return copy.id;
        }
      }
      copy.id = ++next_id;
      store[table_name].push(copy);
      return copy.id;
    },
    async Delete(table_name, ids)
    {
      if (!store[table_name]) return false;
      const initial_len = store[table_name].length;
      store[table_name] = store[table_name].filter(i => !ids.includes(i.id));
      return store[table_name].length < initial_len;
    },
    async Count(table_name)
    {
      return (store[table_name] || []).length;
    }
  };
}

function Create_Mock_Ctx(initial_records = {})
{
  const db = Create_Mock_Db(initial_records);
  const ctx = {
    db,
    Profile
  };
  return ctx;
}
