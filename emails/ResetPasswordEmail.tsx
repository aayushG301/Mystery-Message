import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  username: string;
  resetUrl: string;
}

export default function ResetPasswordEmail({
  username,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset your password</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Reset your password</Preview>
      <Section style={{ padding: "24px" }}>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            We received a request to reset your password. Click the button
            below to choose a new one. The link expires in 1 hour.
          </Text>
        </Row>
        <Row>
          <Button
            href={resetUrl}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "6px",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Reset password
          </Button>
        </Row>
        <Row>
          <Text style={{ fontSize: "13px", color: "#6b7280" }}>
            If the button doesn&apos;t work, copy and paste this link into your
            browser:
            <br />
            {resetUrl}
          </Text>
        </Row>
        <Row>
          <Text style={{ fontSize: "13px", color: "#6b7280" }}>
            If you didn&apos;t ask for this, you can safely ignore this email.
            Your password won&apos;t change.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
