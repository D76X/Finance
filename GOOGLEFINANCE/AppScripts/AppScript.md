# Google Apps Script

[Automate & extend Google Workspace with simple code - Google](https://developers.google.com/apps-script)  

---

# Analytics with Adam

[Apps Script For Google Sheets from Scratch - Playlist - Analytics with Adam](https://www.youtube.com/playlist?list=PLNvPFA43mDu5oszvH_FoO4xcxxy9UMBZS)  

[Google Apps Script for Beginners: Start Automating Google Sheets Analytics with Adam](https://www.youtube.com/watch?v=8UmdqwY9AdA)  

[Automate Google Sheets with App Script - Beginner Tutorial #1 - Variables Analytics with Adam](https://www.youtube.com/watch?v=JLdNy-bpJnI&list=PLNvPFA43mDu5oszvH_FoO4xcxxy9UMBZS&index=2)  

---

# What are Deployments and Versions in App Scripts and what are the differences between them?

[App SCripts Versions & Deployments](https://developers.google.com/apps-script/guides/versions)  

A version in Google Apps Script is an immutable, static snapshot of your code at a point in time, 
whereas a deployment is a live release mechanism that exposes a specific version (or your active head code) 
to users via a unique URL, ID, or interface. 

[1] (https://developers.google.com/apps-script/concepts/deployments), 
[2] (https://developers.google.com/apps-script/guides/versions), 
[3] (https://upsklyai.com/blog/automations/apps-script-deployment-types/)

# Core Concepts

## What is a Version?

• Definition: A numbered "save point" or snapshot of your script project's code.

• Immutability: Once a version is saved, its code cannot be modified. If you need to change it, you must create a new version.

• Purpose: It tracks code evolution, allows you to compare changes, and acts as a rollback point if a bug is introduced. Up to 200 versions can be stored in a single script project. [1] (https://developers.google.com/apps-script/guides/versions), 

[2] (https://developers.google.com/apps-script/concepts/deployments)

What is a Deployment?

• Definition: A published release that makes your script accessible to the outside world or to other systems (as a web app, add-on, API executable, or library). [1] (https://bettersheets.co/explained/deployment), [2] (https://developers.google.com/apps-script/concepts/deployments)
• Connection: A deployment points to either a specific version (Versioned deployment) or directly to your live editor code (Head deployment). [1] (https://developers.google.com/apps-script/concepts/deployments)
• Identity: Each deployment has its own configuration settings—such as execution identity (Execute as me vs. user) and access permissions (Anyone, Only myself)—and often a unique URL or deployment ID. [1] (https://bettersheets.co/explained/deployment)

Key Differences


Feature / Attribute	Version	Deployment
Nature	A static, frozen copy of source code.	A live, configured release wrapper serving the code.
Mutability	Immutable; cannot be edited after creation.	Mutable; can be updated to point to a newer version or reconfigured.
Public URL / ID	None (internal to the project history).	Has a unique URL, web app endpoint, or deployment ID.
Primary Use	Archiving historical code states and rollback safety.	Exposing tools to end-users, web browsers, or external APIs.
Types	Just a single category of numbered snapshot.	Head deployments (testing/dev) or Versioned deployments (production).


How They Work Together

1. Testing with Head Deployments: By default, your script has a Head deployment, which always syncs with the most recently saved code in your editor (often accessed via a /dev URL). This is strictly for developer testing. [1] (https://developers.google.com/apps-script/concepts/deployments), [2] (https://upsklyai.com/blog/automations/apps-script-deployment-types/)
2. Promoting to Versioned Deployments: When you are ready for real users or external integrations to use your app via an /exec URL, you create a Version (snapshot) and attach a Versioned deployment to it. [1] (https://developers.google.com/apps-script/concepts/deployments), [2] (https://upsklyai.com/blog/automations/apps-script-deployment-types/)
3. Updating Live Apps Without Changing URLs: If you edit your code and want production users to see the update without breaking their bookmark or link, you save a new version of your code, go to Deploy > Manage deployments, edit the existing deployment, and switch the version dropdown to the new version. [1] (https://www.reddit.com/r/GoogleAppsScript/comments/1cvy6lr/web_app_deployment_versions/), [2] (https://developers.google.com/apps-script/guides/versions), [3] (https://bettersheets.co/explained/deployment)
Are you trying to update a live web app, publish a library, or set up a test versus production workflow in your script?


---