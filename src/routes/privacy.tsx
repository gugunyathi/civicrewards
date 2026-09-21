import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — CivicRewards" },
      {
        name: "description",
        content:
          "How CivicRewards collects, uses, and protects personal information, in line with South Africa's Protection of Personal Information Act (POPIA).",
      },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  { id: "who-we-are", label: "1. Who we are" },
  { id: "what-we-collect", label: "2. What we collect" },
  { id: "why-we-collect-it", label: "3. Why we collect it, and our legal basis" },
  { id: "who-we-share-with", label: "4. Who we share it with" },
  { id: "payments", label: "5. Payments" },
  { id: "bonds-disclaimer", label: "6. Tokenised bonds and financial features" },
  { id: "storage-security", label: "7. Storage, security, and retention" },
  { id: "cookies", label: "8. Cookies and local storage" },
  { id: "children", label: "9. Children's information" },
  { id: "cross-border", label: "10. Cross-border transfer" },
  { id: "your-rights", label: "11. Your rights under POPIA" },
  { id: "complaints", label: "12. Complaints and the Information Regulator" },
  { id: "changes", label: "13. Changes to this policy" },
  { id: "contact", label: "14. Contact us" },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="pt-8 first:pt-0 scroll-mt-24">
      <h2 className="font-display text-lg sm:text-xl font-extrabold text-ink mb-3">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-brand-deep hover:bg-mint transition shadow-sm border border-ink/10"
          >
            <ArrowLeft className="size-3.5" />
            Back to Home
          </Link>
          <p className="font-display text-sm font-extrabold text-ink">CivicRewards</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-deep">Privacy Policy</p>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-1.5">
          How CivicRewards handles your personal information
        </h1>
        <p className="mt-3 text-sm text-ink/60">
          Last updated: 21 September 2026. This policy applies to civicrewards.co.za and its Ward 115
          resident reporting and councillor dashboard tools.
        </p>

        <div className="mt-6 rounded-2xl bg-mint/50 border border-brand/20 p-4 text-xs leading-relaxed text-ink/80">
          <strong>Plain-English summary:</strong> if you submit a service delivery report, we collect
          your name, address, suburb, and a description of the problem, and pass it to your ward
          councillor and the relevant municipal department so it can be fixed. If you sign up as a
          councillor, we collect your name, email, and ward number. If you pay for something on the
          site, Paystack handles your card details, not us. We don't sell your information, and we
          don't run advertising trackers on this site. Full detail is below.
        </div>

        <nav className="mt-8 rounded-2xl border border-ink/10 bg-white p-4 sm:p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink/40 mb-2">On this page</p>
          <ul className="grid sm:grid-cols-2 gap-1.5 text-xs">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-brand-deep hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 divide-y divide-ink/10">
          <Section id="who-we-are" title="1. Who we are">
            <p>
              CivicRewards is operated by Signal Desk (Pty) Ltd, trading as Vessel Technologies
              ("CivicRewards", "we", "us", "our"), a private company registered in South Africa and
              based in Johannesburg, Gauteng. We are the "responsible party" for personal information
              processed through civicrewards.co.za, as that term is defined in the Protection of
              Personal Information Act 4 of 2013 ("POPIA").
            </p>
          </Section>

          <Section id="what-we-collect" title="2. What we collect">
            <p>We only collect what each feature actually needs to work. Specifically:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Service delivery reports.</strong> When you submit a report through the
                resident app, we collect your name, your suburb, the street address or landmark of the
                problem, a description of the issue, and, if you already have one, a municipal
                reference number. We do not collect a phone number through this form.
              </li>
              <li>
                <strong>Councillor accounts.</strong> When a councillor signs up for the councillor
                dashboard, we collect their full name, email address, password (stored securely by our
                authentication provider, never in plain text), ward number, and optionally a
                municipality name and phone number. New accounts start unapproved, and we manually
                verify that the person is a real ward councillor before granting access.
              </li>
              <li>
                <strong>Escalation contact directory.</strong> Approved councillors can register
                WhatsApp numbers for municipal departments or service providers (for example, a water
                depot or JMPD contact) inside their own dashboard. These are departmental contact
                numbers, not resident personal numbers.
              </li>
              <li>
                <strong>Payments.</strong> If you make a payment on the site, our payment processor
                collects what it needs to process the transaction. See section 5.
              </li>
              <li>
                <strong>Technical information.</strong> Standard web server logs (IP address, browser
                type, timestamps) for security and to keep the site running, and a login session token
                stored in your browser if you sign in.
              </li>
            </ul>
          </Section>

          <Section id="why-we-collect-it" title="3. Why we collect it, and our legal basis">
            <p>Under POPIA, we need a valid legal basis to process personal information. Ours are:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Consent.</strong> Before you submit a service delivery report, you're asked to
                explicitly confirm that your name, address, and report details can be shared with your
                ward councillor and the municipal department. We do not submit a report without that
                consent.
              </li>
              <li>
                <strong>Performance of a contract.</strong> To create and run a councillor account, and
                to process a payment you've asked to make.
              </li>
              <li>
                <strong>Legitimate interest.</strong> To keep the platform secure, prevent abuse, and
                improve reliability, in a way that doesn't override your own privacy rights.
              </li>
            </ul>
          </Section>

          <Section id="who-we-share-with" title="4. Who we share it with">
            <p>We share personal information only where a feature genuinely requires it:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Report details (name, address, suburb, description) are sent to Signal Desk's Ward 115
                service delivery system, which forwards them to your ward councillor and, where
                applicable, logs a reference with the relevant municipal department.
              </li>
              <li>
                Councillor account and dashboard data is stored in our database (Supabase), which we
                use as our infrastructure provider. Report data shown on the councillor dashboard is
                read-only, and is served through a server-side process that checks the councillor is
                approved and only shows reports for their own ward.
              </li>
              <li>Payment details are handled directly by Paystack. See section 5.</li>
              <li>
                We do not sell personal information to anyone, and we do not share it with advertisers
                or data brokers.
              </li>
              <li>
                We may disclose personal information if legally required to do so, for example under a
                valid court order or statutory request.
              </li>
            </ul>
          </Section>

          <Section id="payments" title="5. Payments">
            <p>
              Card payments on civicrewards.co.za are processed by Paystack (Pty) Ltd, a licensed
              South African payment service provider. When you pay, your card details are entered
              directly into Paystack's own secure checkout. We never receive or store your full card
              number, expiry date, or CVV. We only receive your email address, the amount, and a
              payment reference, which we use to confirm your transaction went through. Paystack's own
              privacy policy governs how it handles your payment details.
            </p>
          </Section>

          <Section id="bonds-disclaimer" title="6. Tokenised bonds and other financial features">
            <p>
              Some pages on civicrewards.co.za describe planned features such as tokenised utility
              bonds, sovereign bonds, or fractional municipal bonds (for example, "Jozibonds"), and
              redemption of civic points into these or similar instruments. These are described as
              part of our product roadmap, not as products currently on offer. As stated on our
              homepage: civic points begin as non-financial loyalty units, and any future redemption
              into a financial or investment-linked product depends on explicit user choice, formal
              agreements with regulated third-party partners, and legal and regulatory clearance,
              which may include approval from bodies such as the Financial Sector Conduct Authority.
            </p>
            <p>
              Until such a product is formally launched and separately disclosed, no personal or
              financial information is collected for it, CivicRewards is not acting as a financial
              services provider, credit provider, or deposit-taking institution, and nothing on this
              site is investment advice or a solicitation to invest.
            </p>
          </Section>

          <Section id="storage-security" title="7. Storage, security, and retention">
            <p>
              We use industry-standard security practices, including row-level security on our
              database, encrypted connections (HTTPS) for all traffic, and service-role database
              access restricted to server-side processes that first verify who you are. Sensitive keys
              are never exposed to your browser.
            </p>
            <p>
              We keep personal information for as long as reasonably necessary for the purpose it was
              collected for, for example, for as long as a report or councillor account remains
              relevant to service delivery tracking, or as required by law. You can ask us to delete
              your information at any time, subject to section 11.
            </p>
          </Section>

          <Section id="cookies" title="8. Cookies and local storage">
            <p>
              CivicRewards does not currently run advertising or analytics tracking cookies. If you
              sign in to the councillor dashboard, your browser stores a login session token locally
              so you don't have to sign in again on every page. That's the only thing stored in your
              browser by us.
            </p>
          </Section>

          <Section id="children" title="9. Children's information">
            <p>
              CivicRewards is intended for use by adults (18 and older) reporting on municipal service
              issues, and by verified ward councillors. We do not knowingly collect personal
              information from children. If you believe a child's information has been submitted to
              us, please contact us using the details in section 14 and we will remove it.
            </p>
          </Section>

          <Section id="cross-border" title="10. Cross-border transfer">
            <p>
              Some of our infrastructure providers, including our database and payment processing
              partners, may process or store data using infrastructure located outside South Africa.
              Where this happens, we rely on providers that maintain appropriate security and
              contractual safeguards for personal information, consistent with POPIA's requirements
              for cross-border transfer.
            </p>
          </Section>

          <Section id="your-rights" title="11. Your rights under POPIA">
            <p>Under POPIA, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Ask us to confirm what personal information we hold about you, and to see it.</li>
              <li>Ask us to correct or update information that is inaccurate or out of date.</li>
              <li>
                Ask us to delete personal information we no longer have a lawful basis to keep, or
                that you gave consent for and are now withdrawing consent to.
              </li>
              <li>Object to processing that's based on legitimate interest, on reasonable grounds.</li>
              <li>Complain to us directly, or to the Information Regulator (see section 12).</li>
            </ul>
            <p>
              To exercise any of these rights, contact us using the details in section 14. We will
              respond within a reasonable time, and in any event within the timeframes POPIA sets out.
            </p>
          </Section>

          <Section id="complaints" title="12. Complaints and the Information Regulator">
            <p>
              If you're unhappy with how we've handled your personal information, please contact us
              first, so we can try to resolve it directly. You also have the right to lodge a
              complaint with South Africa's Information Regulator:
            </p>
            <p className="rounded-xl bg-white border border-ink/10 p-4 text-xs">
              Information Regulator (South Africa)
              <br />
              JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001
              <br />
              Email: enquiries@inforegulator.org.za
              <br />
              Website: www.inforegulator.org.za
              <br />
              <span className="text-ink/50">
                (Contact details correct as of publication, please check the Information Regulator's
                own website for the most current details.)
              </span>
            </p>
          </Section>

          <Section id="changes" title="13. Changes to this policy">
            <p>
              We may update this policy as CivicRewards' features change. If we make a material
              change, we'll update the "last updated" date at the top of this page. We encourage you
              to check back periodically.
            </p>
          </Section>

          <Section id="contact" title="14. Contact us">
            <p>
              For any privacy question, or to exercise your rights under POPIA, contact our
              Information Officer:
            </p>
            <p className="rounded-xl bg-white border border-ink/10 p-4 text-xs">
              Thamsanqa Nyathi, Information Officer
              <br />
              Signal Desk (Pty) Ltd t/a Vessel Technologies
              <br />
              Email: Hello@signaldesk.co.za
              <br />
              Phone: +27 10 142 5338
              <br />
              Johannesburg, Gauteng, South Africa
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-6 border-t border-ink/10 text-xs text-ink/50">
          See also our{" "}
          <Link to="/terms" className="text-brand-deep hover:underline font-semibold">
            Terms and Conditions
          </Link>
          .
        </div>
      </main>
    </div>
  );
}
