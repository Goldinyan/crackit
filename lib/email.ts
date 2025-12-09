import { requestLoginCode } from "./db";

export async function sendEmail(to: string, subject: string, html: string) {
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, html }),
      });
  
      // Prüfe ob die Antwort JSON ist
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
  
      console.log("Status:", res.status);
      console.log("Text:", text);
    } catch (err) {
      console.error("Fehler beim Senden:", err);
    }
  }


  export async function sendVerificationCodePerEmail(to: string, username: string){
    const subject = `${username}, this is your verification code:`;
    const html = `${requestLoginCode(username)}, If you didnt send it dont care`;
    
    await sendEmail(to, subject, html);
}
