# Enquiry retention procedure (email, WhatsApp, phone)

**Published rule** (privacy policy): enquiries that do not lead to an assignment are
deleted when the person says they have stopped looking, or **at the latest 24 months
after the last contact** (proposed; `site.legal.enquiryRetentionMonths`).

**Nothing deletes these automatically.** Gmail, WhatsApp and the phone keep messages
until someone deletes them. This procedure is done by hand.

## Why we act one month early

Deleting is not instant everywhere (verified on Google's and WhatsApp's own help
pages, 26 Nov 2026):

- **Gmail:** a deleted message stays in the Bin for 30 days unless the Bin is emptied.
  After it leaves the Bin, a Google Workspace administrator can still restore it for
  **25 more days**; after that it cannot be restored.
- **WhatsApp:** each phone number has **one** chat backup (iCloud, or Google
  account/WhatsApp storage on Android). A new backup **replaces** the old one. A
  deleted chat stays in the existing backup until a new backup is made after the
  deletion. If backups are switched off, the old backup still contains it.

So every enquiry gets an **action date = last contact + 23 months** (or the day the
person says they have stopped looking). Acting then leaves a month for the Gmail
recovery window and the next WhatsApp backup, so the data is gone by the published
24-month deadline.

## The enquiry log

One Google Sheet, one row per person:

| # | Name | Channel | Last contact | Status | Action date |
|---|---|---|---|---|---|

- Status: `active`, `closed` or `client`.
- Action date = last contact + 23 months.
- Keep only these columns; the log is personal data too.

## When an enquiry arrives

1. Add a row.
2. In Google Calendar, create an event on the **action date**: "Delete enquiry #‹row›"
   (row number only, no name), with a reminder one week before.
3. Gmail: apply the label `Enquiry`.

## Whenever there is new contact

Update "Last contact" and the action date in the log, and **move the calendar event**
to the new action date.

## On the action date (calendar reminder)

1. **Gmail:** search `from:their@address OR to:their@address`, select the threads,
   delete them, then open **Bin** and **empty it** for those messages. Delete the
   person from Google Contacts.
2. **WhatsApp:** open the chat → contact name → **Delete chat**, ticking "also delete
   media". Then **Settings → Chats → Chat backup → Back up now**, and check that
   "Last backup" shows today.
3. **Phone:** delete call-log entries and the contact (synced contacts are removed
   from iCloud/Google too).
4. **Saved files:** if they sent documents or photos that were saved to Photos or
   Drive, delete them and also empty **Recently deleted** (Photos) / **Bin** (Drive).
5. **Log:** delete the row. Keep a one-line record without personal data:
   "#‹row›, deleted ‹date›".

## Monthly check (first Monday, 10 minutes)

A missed reminder must not mean a missed deadline. Sort the log by action date and
handle **every row with an action date before the end of next month**, using the steps
above. The calendar reminder is the main trigger; this check is the safety net.

## One-time settings and checks

- **WhatsApp:** turn on automatic chat backup **daily** (Settings → Chats → Chat
  backup), so a new backup always follows a deletion within a day. Turn off **Save to
  Photos** (iPhone) / **Media visibility** (Android).
- **Other backups:** if you back up the phone to a computer (Finder/iTunes), those
  backups are snapshots and can still contain deleted chats; delete old computer
  backups you no longer need.
- **Google Workspace:** check that no Google Vault retention rule keeps mail longer
  than this policy (Admin console → Vault, available on some Workspace editions).
- Do not use WhatsApp "disappearing messages" for this: the longest setting is 90 days.
- Avoid bulk Gmail deletion with `older_than:`: in conversation view it can delete
  threads that also contain recent messages. Go person by person.

## Limits to be aware of

- The other person keeps their own copy of emails and WhatsApp chats; that is theirs.
- Copies that already left our systems (forwarded emails, shared files) must be
  traced and deleted too.

## Deletion requests

If someone asks to be deleted, follow "On the action date" within one month of the
request (GDPR deadline), confirm by reply, and delete that exchange the same way.

## When an enquiry becomes a client

Move identity documents and transaction papers into one secure client folder; they
follow the legal periods (anti-money-laundering, tax, accounting), not the 24 months.
Delete the WhatsApp/email copies as above and set the status to `client`.
