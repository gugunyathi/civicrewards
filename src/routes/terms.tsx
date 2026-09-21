import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — CivicRewards" },
      {
        name: "description",
        content:
          "The terms that apply to using CivicRewards' service delivery reporting platform, councillor dashboard, and rewards program.",
      },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  { id: "acceptance", label: "1. Acceptance of these terms" },
  { id: "the-service", label: "2. What CivicRewards is" },
  { id: "eligibility", label: "3. Who can use it" },
  { id: "reports", label: "4. Submitting a service delivery report" },
  { id: "councillor-accounts", label: "5. Councillor accounts" },
  { id: "points-rewards", label: "6. Civic points and rewards" },
  { id: "bonds-and-partners", label: "7. Tokenised bonds and third-party partner services" },
  { id: "payments", label: "8. Payments" },
  { id: "no-financial-advice", label: "9. No financial or investment advice" },
  { id: "acceptable-use", label: "10. Acceptable use" },
  { id: "ip", label: "11. Intellectual property" },
  { id: "disclaimers", label: "12. Disclaimers" },
  { id: "liability", label: "13. Limitation of liability" },
  { id: "termination", label: "14. Suspension and termination" },
  { id: "law", label: "15. Governing law" },
  { id: "changes", label: "16. Changes to these terms" },
  { id: "contact", label: "17. Contact us" },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="pt-8 first:pt-0 scroll-mt-24">
      <h2 className="font-display text-lg sm:text-xl font-extrabold text-ink mb-3">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

function TermsPage() {
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
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-deep">
          Terms and Conditions
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mt-1.5">
          The terms for using CivicRewards
        </h1>
        <p className="mt-3 text-sm text-ink/60">
          Last updated: 21 September 2026. By using civicrewards.co.za, you agree to these terms.
        </p>

        <div className="mt-6 rounded-2xl bg-mint/50 border border-brand/20 p-4 text-xs leading-relaxed text-ink/80">
          <strong>Plain-English summary:</strong> use CivicRewards to report real municipal service
          problems honestly. Councillor accounts are manually approved and for real ward councillors
          only. Civic points are loyalty units, not money, unless and until a real, regulated
          redemption partner is live, which several pages describe as a future possibility, not a
          current offer. We don't guarantee the municipality will fix anything by any particular
          time. Full detail is below.
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
          <Section id="acceptance" title="1. Acceptance of these terms">
            <p>
              These terms are a legal agreement between you and Signal Desk (Pty) Ltd, trading as
              Vessel Technologies ("CivicRewards", "we", "us", "our"), governing your use of
              civicrewards.co.za and its related resident reporting and councillor dashboard tools. By
              accessing or using the site, you agree to these terms. If you don't agree, please don't
              use the site. See also our{" "}
              <Link to="/privacy" className="text-brand-deep hover:underline font-semibold">
                Privacy Policy
              </Link>
              , which explains how we handle personal information and forms part of these terms.
            </p>
          </Section>

          <Section id="the-service" title="2. What CivicRewards is">
            <p>
              CivicRewards is a platform that lets residents report municipal service delivery
              problems (such as water, electricity, roads, and refuse issues) to their ward councillor
              and the relevant municipal department, and lets verified ward councillors view and
              manage those reports for their own ward. The site also describes a broader vision,
              including civic points, local merchant redemption, and future planned features. Section
              6 and 7 explain exactly what is live today, and what is roadmap only.
            </p>
          </Section>

          <Section id="eligibility" title="3. Who can use it">
            <p>
              You must be 18 or older to create an account or submit a report. The resident reporting
              tool currently supports Ward 115 (Fourways, Witkoppen, Douglasdale, and surrounding
              areas) only. Other wards may be listed as "coming soon" but are not yet connected to a
              real municipal reporting pipeline.
            </p>
          </Section>

          <Section id="reports" title="4. Submitting a service delivery report">
            <p>
              When you submit a report, you confirm that the information you provide (your name,
              address, suburb, and description of the problem) is accurate to the best of your
              knowledge, and you consent to it being shared with your ward councillor and the relevant
              municipal department, as described in our Privacy Policy. Submitting a report requires
              ticking a consent checkbox before the form can be sent.
            </p>
            <p>
              We do not invent or guarantee municipal reference numbers. If a report doesn't have one
              yet, that's normal, most first-time reports don't. We also don't grade the severity or
              urgency of your report, or promise a specific resolution time, because we don't control
              municipal departments' own response times.
            </p>
            <p>
              Emergency situations (for example, immediate danger to life or property) should be
              reported directly to emergency services or your municipality's emergency line, not
              through this form.
            </p>
          </Section>

          <Section id="councillor-accounts" title="5. Councillor accounts">
            <p>
              Councillor dashboard accounts are approval-gated. Creating an account does not grant
              access, we manually verify that you are a real, serving ward councillor for the ward you
              claim before approving your account. You're responsible for keeping your login details
              confidential, and for all activity under your account. We may suspend or remove an
              account we reasonably believe was created fraudulently, or is being misused.
            </p>
          </Section>

          <Section id="points-rewards" title="6. Civic points and rewards">
            <p>
              Civic points, as described on this site, are non-financial loyalty units. They are not
              money, a deposit, a security, or a financial instrument of any kind, unless and until a
              specific, separately disclosed redemption product says otherwise. We can change, pause,
              or discontinue the points program, local merchant offers, or any specials at any time,
              and we don't guarantee any particular point value, redemption option, or that a
              redemption partner will remain available.
            </p>
          </Section>

          <Section id="bonds-and-partners" title="7. Tokenised bonds and third-party partner services">
            <p>
              Some pages on this site describe potential future offerings, including tokenised
              utility bonds, sovereign bonds, and fractional municipal bonds (for example,
              "Jozibonds"), and ways civic points might one day convert into these or similar
              instruments. These are roadmap concepts, not products currently available for purchase,
              investment, or redemption.
            </p>
            <p>Any such product, if and when it launches, will only be delivered:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                through a licensed, regulated third-party partner, since CivicRewards itself is not a
                licensed financial services provider, credit provider, or deposit-taking institution,
                and is not a lender;
              </li>
              <li>
                subject to all applicable regulatory approval, which may include approval from the
                Financial Sector Conduct Authority, the National Credit Regulator, and/or the South
                African Reserve Bank, depending on how the final product is structured; and
              </li>
              <li>
                under its own separate terms and disclosures, published at the time that specific
                product actually goes live.
              </li>
            </ul>
            <p>
              Nothing on civicrewards.co.za today is an offer, solicitation, or invitation to invest
              in, purchase, or subscribe for any financial instrument or bond.
            </p>
          </Section>

          <Section id="payments" title="8. Payments">
            <p>
              Where you make a payment on the site, it's processed by Paystack (Pty) Ltd, a licensed
              South African payment service provider, under Paystack's own terms of service. We are
              not a party to the payment processing itself, and don't store your full card details.
            </p>
          </Section>

          <Section id="no-financial-advice" title="9. No financial or investment advice">
            <p>
              Nothing on civicrewards.co.za constitutes financial, investment, tax, or legal advice.
              Descriptions of potential future bond or investment-linked products are illustrative of
              our product direction only, and shouldn't be relied on for any financial decision.
              Please get independent advice before making any financial decision.
            </p>
          </Section>

          <Section id="acceptable-use" title="10. Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>submit false, fraudulent, or misleading reports;</li>
              <li>impersonate a ward councillor, municipal official, or anyone else;</li>
              <li>
                attempt to access another resident's or councillor's account or data, or bypass the
                platform's access controls;
              </li>
              <li>
                use the site to send unsolicited messages, or for any unlawful purpose under South
                African law.
              </li>
            </ul>
          </Section>

          <Section id="ip" title="11. Intellectual property">
            <p>
              The CivicRewards name, logo, site design, and content are owned by Signal Desk (Pty) Ltd
              t/a Vessel Technologies, or used under licence. You may not copy, reproduce, or use our
              branding or content without our prior written permission, other than to the extent
              needed to use the site normally.
            </p>
          </Section>

          <Section id="disclaimers" title="12. Disclaimers">
            <p>
              CivicRewards is provided "as is". We don't guarantee that any report you submit will be
              resolved, resolved within any particular time, or actioned at all by the relevant
              municipal department, since final action is outside our control. We don't guarantee the
              site will be uninterrupted, error-free, or available at all times.
            </p>
          </Section>

          <Section id="liability" title="13. Limitation of liability">
            <p>
              To the maximum extent permitted by South African law, Signal Desk (Pty) Ltd t/a Vessel
              Technologies will not be liable for any indirect, incidental, or consequential loss
              arising from your use of CivicRewards, including loss arising from a municipal
              department's action or inaction, a third-party partner's conduct (including Paystack or
              any local merchant), or reliance on roadmap features described on the site that are not
              yet live. Nothing in these terms limits liability that cannot lawfully be excluded.
            </p>
          </Section>

          <Section id="termination" title="14. Suspension and termination">
            <p>
              We may suspend or terminate your access to CivicRewards if you breach these terms, or if
              we reasonably believe your account poses a security or integrity risk to the platform.
              You may stop using the site, or ask us to delete your account, at any time.
            </p>
          </Section>

          <Section id="law" title="15. Governing law">
            <p>
              These terms are governed by the laws of the Republic of South Africa. Any dispute will
              be subject to the jurisdiction of the South African courts, Gauteng Division,
              Johannesburg.
            </p>
          </Section>

          <Section id="changes" title="16. Changes to these terms">
            <p>
              We may update these terms as CivicRewards evolves. If we make a material change, we'll
              update the "last updated" date at the top of this page. Continuing to use the site after
              a change means you accept the updated terms.
            </p>
          </Section>

          <Section id="contact" title="17. Contact us">
            <p className="rounded-xl bg-white border border-ink/10 p-4 text-xs">
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
          <Link to="/privacy" className="text-brand-deep hover:underline font-semibold">
            Privacy Policy
          </Link>
          .
        </div>
      </main>
    </div>
  );
}
