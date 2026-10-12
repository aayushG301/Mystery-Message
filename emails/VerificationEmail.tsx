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

interface VerificationEmailProps {
  username: string;
  verificationUrl: string;
}

export default function VerificationEmail({
  username,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify your email</title>
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
      <Preview>Verify your email to finish signing up</Preview>
      <Section style={{ padding: "24px" }}>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Please click the button below to verify
            your email address and complete your registration:
          </Text>
        </Row>
        <Row>
          <Button
            href={verificationUrl}
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
            Verify email
          </Button>
        </Row>
        <Row>
          <Text style={{ fontSize: "13px", color: "#6b7280" }}>
            If the button doesn&apos;t work, copy and paste this link into your
            browser:
            <br />
            {verificationUrl}
          </Text>
        </Row>
        <Row>
          <Text style={{ fontSize: "13px", color: "#6b7280" }}>
            If you did not create an account, you can safely ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
