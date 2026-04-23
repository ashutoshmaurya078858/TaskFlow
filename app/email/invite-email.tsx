import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Img,
  Font,
  Link,
  Preview,
} from "@react-email/components";

export default function InviteEmail({
  workspaceName,
  inviteLink,
  inviterName = "Someone",
}: {
  workspaceName: string;
  inviteLink: string;
  inviterName?: string;
}) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="DM Sans"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZOIHQ.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="DM Sans"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/dmsans/v15/rP2Cp2ywxg089UriASitCBimCw.woff2",
            format: "woff2",
          }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>

      <Preview>
        {inviterName} invited you to join {workspaceName} on FlowTask
      </Preview>

      <Body style={body}>
        {/* Outer wrapper */}
        <Container style={outerContainer}>
          {/* Top accent bar */}
          <Section style={accentBar} />

          {/* Logo + brand */}
          <Section style={brandSection}>
            <Img
              src="https://res.cloudinary.com/dk52yi0f5/image/upload/v1776924155/logo_jw9fow.svg"
              alt="FlowTask"
              width="170"
              height="80"
              style={{
                display: "block",
                margin: "0 auto",
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </Section>

          {/* Hero section */}
          <Section style={heroSection}>
            {/* Decorative dots grid */}
            <table
              style={{ width: "100%", marginBottom: "28px" }}
              cellPadding={0}
              cellSpacing={0}
            >
              <tbody>
                <tr>
                  <td style={{ textAlign: "center" }}>
                    {[
                      "#e0e7ff",
                      "#c7d2fe",
                      "#a5b4fc",
                      "#818cf8",
                      "#6366f1",
                      "#818cf8",
                      "#a5b4fc",
                      "#c7d2fe",
                      "#e0e7ff",
                    ].map((color, i) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-block",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          margin: "0 3px",
                        }}
                      />
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>

            <Text style={heroLabel}>You have an invitation</Text>

            <Text style={heroTitle}>
              Join <span style={heroTitleAccent}>{workspaceName}</span>
            </Text>

            <Text style={heroSubtitle}>
              {inviterName} has invited you to collaborate on{" "}
              <strong style={{ color: "#1e1b4b" }}>{workspaceName}</strong>.
              FlowTask helps your team move faster — manage tasks, track
              progress, and ship together.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button href={inviteLink} style={ctaButton}>
              Accept Invitation →
            </Button>
            <Text style={ctaNote}>This invitation expires in 7 days</Text>
          </Section>

          {/* Feature pills */}
          <Section style={pillsSection}>
            {[
              "Task Boards",
              "Team Chat",
              "Progress Tracking",
              "Integrations",
            ].map((feature) => (
              <span key={feature} style={pill}>
                {feature}
              </span>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Fallback link */}
          <Section style={fallbackSection}>
            <Text style={fallbackTitle}>Having trouble with the button?</Text>
            <Text style={fallbackText}>
              Copy and paste this link into your browser:
            </Text>
            <Text style={fallbackLink}>{inviteLink}</Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              You received this email because someone invited you to FlowTask.
              If you weren't expecting this, you can safely ignore it.
            </Text>
            <Text style={footerLinks}>
              <Link href="https://flowtask.io" style={footerLink}>
                flowtask.io
              </Link>
              {"  ·  "}
              <Link href="https://flowtask.io/privacy" style={footerLink}>
                Privacy
              </Link>
              {"  ·  "}
              <Link href="https://flowtask.io/unsubscribe" style={footerLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>

          {/* Bottom accent bar */}
          <Section style={bottomAccentBar} />
        </Container>
      </Body>
    </Html>
  );
}

/* ─── Styles ─── */

const body: React.CSSProperties = {
  backgroundColor: "#f0f0f7",
  fontFamily: "'DM Sans', Helvetica, Arial, sans-serif",
  margin: "0",
  padding: "40px 16px",
};

const outerContainer: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 24px rgba(99, 102, 241, 0.10)",
};

const accentBar: React.CSSProperties = {
  background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)",
  height: "4px",
  display: "block",
};

const brandSection: React.CSSProperties = {
  display: "block",
  margin: "0 auto",
  maxWidth: "140px",
  height: "auto",
};

const logoMark: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  backgroundColor: "#4f46e5",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "middle",
};

const logoMarkText: React.CSSProperties = {
  color: "#ffffff",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "32px",
  display: "block",
  textAlign: "center",
};

const brandName: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "18px",
  color: "#1e1b4b",
  margin: "0",
  lineHeight: "32px",
};

const heroSection: React.CSSProperties = {
  padding: "32px 40px 24px",
  textAlign: "center",
};

const heroLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#6366f1",
  margin: "0 0 12px",
};

const heroTitle: React.CSSProperties = {
  fontSize: "30px",
  fontWeight: 600,
  color: "#1e1b4b",
  lineHeight: "1.25",
  margin: "0 0 16px",
};

const heroTitleAccent: React.CSSProperties = {
  color: "#4f46e5",
};

const heroSubtitle: React.CSSProperties = {
  fontSize: "15px",
  color: "#6b7280",
  lineHeight: "1.65",
  margin: "0",
  maxWidth: "420px",
};

const ctaSection: React.CSSProperties = {
  padding: "8px 40px 24px",
  textAlign: "center",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#4f46e5",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 600,
  padding: "14px 36px",
  borderRadius: "10px",
  textDecoration: "none",
  display: "inline-block",
  letterSpacing: "0.01em",
};

const ctaNote: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "12px 0 0",
};

const pillsSection: React.CSSProperties = {
  padding: "0 40px 32px",
  textAlign: "center",
};

const pill: React.CSSProperties = {
  display: "inline-block",
  fontSize: "12px",
  fontWeight: 500,
  color: "#4f46e5",
  backgroundColor: "#eef2ff",
  border: "1px solid #c7d2fe",
  borderRadius: "99px",
  padding: "4px 12px",
  margin: "3px",
};

const divider: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "0 40px",
};

const fallbackSection: React.CSSProperties = {
  padding: "24px 40px",
};

const fallbackTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
  margin: "0 0 4px",
};

const fallbackText: React.CSSProperties = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "0 0 8px",
};

const fallbackLink: React.CSSProperties = {
  fontSize: "12px",
  color: "#4f46e5",
  wordBreak: "break-all",
  margin: "0",
  backgroundColor: "#f5f3ff",
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #e0e7ff",
};

const footerSection: React.CSSProperties = {
  padding: "20px 40px 28px",
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  lineHeight: "1.6",
  margin: "0 0 10px",
};

const footerLinks: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0",
};

const footerLink: React.CSSProperties = {
  color: "#6b7280",
  textDecoration: "none",
};

const bottomAccentBar: React.CSSProperties = {
  background: "linear-gradient(90deg, #a855f7 0%, #7c3aed 50%, #4f46e5 100%)",
  height: "3px",
  display: "block",
};
