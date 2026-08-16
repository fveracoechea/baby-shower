# Baby-shower Invitation App

One-off invitation app for one combined baby-shower + gender-reveal event: landing page with photos, dedicated phone-identified RSVP page, post-confirmation location/time reveal, tailnet-gated admin view. Bilingual ES/EN.

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
The lookup identifier for an Invitation. Display punctuation and spacing are removed before comparison, and US numbers without a country code keep `+1` compatibility. International numbers include their country code. It is unique across Invitations.
_Avoid_: username, login, phone key

**Additional guest**:
A person who attends with the Guest named on an Invitation. Each Invitation has an Additional-guest allowance from zero through three; an attending Guest chooses any count up to that allowance without naming the Additional guests.
_Avoid_: Plus-one, companion, "+1" as a noun in prose

**Reveal**:
The post-confirmation page shown after an attending RSVP: venue name, address (as a Google Maps link), an embedded Google Map, venue photos, date, start-end time, and the dress code. A declined Guest sees only a "We will miss you" message and the option to edit their RSVP. The public landing shows only the city ("Hoschton, GA") before confirmation.
_Avoid_: details section, location block

**Cutoff**:
Event date minus 7 days, at the end of that calendar day in the event's timezone. New RSVPs and edits freeze at this moment; retrieval stays available read-only.
_Avoid_: deadline, lock date

**Retrieval**:
The main RSVP path also handles Retrieval: a Guest re-enters the phone number on their Invitation and is sent to their filed response (and the Reveal, if attending). Read-only after the Cutoff.
_Avoid_: login, session

**Admin view**:
The host page at `/admin`: a summary strip plus one table where hosts add, edit, and remove Invitations and see each RSVP status. It requires the shared Admin password and keeps a host signed in with an encrypted, 30-day, HttpOnly cookie; the tailnet remains an additional network-level gate. Hosts manage RSVP eligibility and Invitation details, but do not change a Guest's response.
_Avoid_: dashboard, backoffice

**Headcount**:
The sum of one Guest plus their selected Additional-guest count for every attending RSVP - the number the hosts report to the venue. Declined and Awaiting-response Invitations never count.
_Avoid_: total guests, attendance figure

**The Mystery**:
The invitation's conceit: only two people in the world know the baby's sex, and the parents-to-be are not among them. Guests are asked to help solve it. The page is styled as a case file; family and friends follow the clues, test their theories, and solve the Mystery together at the party.
_Avoid_: theme, gimmick

**Witness**:
One of the two people who know the secret: the doctor (discovered it and sealed it in the Secret Envelope) or the anonymous event organizer (opened it and keeps the answer hidden until the party). The parents are not Witnesses.
_Avoid_: suspect, informant

**Secret Envelope**:
The sealed message carrying the secret from the doctor to the event organizer, who opens it and protects the answer until family and friends solve the Mystery at the party. Also the invitation's opening motif: a sealed envelope the Guest opens.
_Avoid_: letter, note

**Theory**:
A guest's optional girl/boy guess filed with their RSVP. Tallied in the Admin view. Not required; a guest may file no theory.
_Avoid_: vote, prediction, bet
