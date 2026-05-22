# TODO

- [ ] Update frontend UserDashboard to remove demo/MOCK bookings after real booking is created.
- [ ] Fetch `/api/bookings/my-bookings` when My Bookings tab is opened (or on mount after auth).
- [ ] Remove any local mock booking state initialization so new bookings appear under My Bookings.
- [ ] Ensure cancel booking updates real backend state (at minimum, refresh bookings after cancel).
- [ ] Verify backend already stores booking with `user` field (confirmed in booking.controller.ts).
- [ ] Remove demo booking data/constants that populate My Bookings.
- [ ] Quick manual test flow: login -> book ride -> check My Bookings -> ensure no demo entries remain.

l