import { authClient} from "@/src/lib/auth-client";

export default function SignUpPage() {
    async function handleSignup() {
        const { data, error } = await authClient.signUp.email({
            name: "John Doe", 
            email: "john.doe@example.com", 
            password: "password1234", 
            image: "https://example.com/image.png", 
            callbackURL: "https://example.com/callback",
        });
        
        if(error) {
            console.error("signup failed:" , error);
            return;
        }
        console.log("Successfully signed up");
    }
    
}