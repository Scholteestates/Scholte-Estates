# Enquiry retention procedure (email, WhatsApp, phone)

The privacy policy says enquiries that do not lead to an assignment are deleted when
the person says they have stopped looking, or at the latest 24 months after the last
contact (proposed; `site.legal.enquiryRetentionMonths`). **Nothing deletes these
automatically.** The website setting only states the policy; the steps below are done
by hand.

## The enquiry log

One spreadsheet in your Google Drive, one row per person:

| Name | Channel | First contact | Last contact | Status | Delete by |
|---|---|---|---|---|---|

- Status: `active`, `closed` or `client`.
- Delete by = last contact + 24 months (or the date they said they stopped looking).
- Update "Last contact" whenever you reply or they write.
- Keep only these columns: the log is personal data too.

## Every new enquiry (1 minute)

1. Add a row to the log.
2. Gmail: apply the label `Enquiry`.
3. WhatsApp: if you save them as a contact, use the same name as in the log.

## Every quarter (15 minutes, calendar reminder)

1. Sort the log by **Delete by**. Take the rows whose date has passed and whose
   status is not `client`.
2. **Gmail:** search `from:their@address OR to:their@address`, select the threads,
   delete. Then open **Bin** and empty it (otherwise Gmail removes them after 30 days).
   Delete the person from Google Contacts if saved.
3. **WhatsApp:** open the chat → contact name → **Delete chat**, and tick the option
   to also delete media. Delete the contact if saved.
4. **Phone:** delete their entries in the call log and the contact.
5. **Photos/Files:** if they sent documents or photos that were saved to your phone or
   Drive, delete those too.
6. Delete the row from the log.

WhatsApp backups (iCloud or Google Drive) are replaced at the next backup, so a deleted
chat leaves the backup after that.

## One-time settings

- WhatsApp → Settings → Chats: turn off **Save to Photos** (iPhone) / **Media
  visibility** (Android), so files people send are not copied to your gallery.
- Do not use WhatsApp "disappearing messages" for this: the longest setting is 90 days,
  too short for a 24-month search.
- Avoid bulk Gmail deletion with `older_than:2y`: in conversation view it can delete
  threads that also contain recent messages. Go person by person.

## When someone asks to be deleted

Delete everything above within one month (the GDPR deadline), reply to confirm, then
delete that exchange too.

## When an enquiry becomes a client

Move identity documents and transaction papers out of WhatsApp/email into one secure
client folder. Those follow the legal periods (anti-money-laundering, tax, accounting),
not the 24 months. Then delete the WhatsApp/email copies and mark the row `client`.
