# Baby-shower Invitation App

One-off invitation app for one combined baby-shower + gender-reveal event: landing page with photos, name-only RSVP, post-confirmation location/time reveal, tailnet-gated admin view. Bilingual ES/EN.

## Language

**Guest**:
A person the hosts have invited to the event. A Guest uses the phone number on their Invitation to access the invitation page; there are no accounts or invite tokens.
_Avoid_: user, account, invitee

**Invitation**:
A host-created record that permits one Guest to submit an RSVP. It contains the Guest's name, normalized phone number, Additional-guest allowance, and RSVP status. A normalized phone number belongs to exactly one Invitation.
_Avoid_: account, registration, guest record

**RSVP**:
A Guest's single response: attending yes/no plus the number of Additional guests attending. One per Invitation; editable by the Guest until the Cutoff.
_Avoid_: signup, registration, booking

**Normalized phone number**:
The lookup identifier for an Invitation. Equivalent US phone-number formats normalize to E.164 (`+1XXXXXXXXXX`) before comparison. It is unique across Invitations.
_Avoid_: username, login, phone key

**Additional guest**:
A person who attends with the Guest named on an Invitation. Each Invitation has an Additional-guest allowance from zero through three; an attending Guest chooses any count up to that allowance without naming the Additional guests.
_Avoid_: Plus-one, companion, "+1" as a noun in prose

**Reveal**:
The post-confirmation content shown only to attending guests: venue name, address (as a Google Maps link), an embedded Google Map, venue photos, date, start-end time, and the dress code. The public landing shows only the city ("Hoschton, GA") before confirmation.
_Avoid_: details section, location block

**Cutoff**:
Event date minus 7 days, at the end of that calendar day in the event's timezone. New RSVPs and edits freeze at this moment; retrieval stays available read-only.
_Avoid_: deadline, lock date

**Retrieval**:
The "Already confirmed?" path: a Guest re-enters the phone number on their Invitation to re-show their RSVP (and the Reveal, if attending). Read-only after the Cutoff.
_Avoid_: login, session

**Admin view**:
The tailnet-gated page at `/admin`: a summary strip plus one table where hosts add, edit, and remove Invitations and see each RSVP status. Network-level gating only (Caddy tailnet matcher) - no app-level auth. Hosts manage RSVP eligibility and Invitation details, but do not change a Guest's response.
_Avoid_: dashboard, backoffice

**Headcount**:
The sum of one Guest plus their selected Additional-guest count for every attending RSVP - the number the hosts report to the venue. Declined and Awaiting-response Invitations never count.
_Avoid_: total guests, attendance figure

**The Mystery**:
The invitation's conceit: only three people in the world know the baby's sex, and the parents-to-be are not among them. Guests are asked to help solve it. The page is styled as a case file; the reveal happens live at the party (balloon + cake).
_Avoid_: theme, gimmick

**Witness**:
One of the three people who know the secret: the doctor (discovered it, sealed it in the Secret Envelope), the balloon store (chose the confetti color), the cake shop (chose the cake filling). Never the parents.
_Avoid_: suspect, informant

**Secret Envelope**:
The sealed message carrying the secret from the doctor to the balloon store, then passed in code to the cake shop. Also the invitation's opening motif: a sealed envelope the guest opens.
_Avoid_: letter, note

**Theory**:
A guest's optional girl/boy guess filed with their RSVP. Tallied in the Admin view. Not required; a guest may file no theory.
_Avoid_: vote, prediction, bet
