import {use} from 'passport';
import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";

export function passportGoogle(){
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID || "",
            clientSecret: GOOGLE_CLIENT_SECRET || "",
            callbackURL: "http://localhost:3000/auth/google",
            passReqToCallback   : true
        },
        function(request, accessToken, refreshToken, profile, done) {
           // @ts-ignore
         const response = emails.includes(profile.emails[0].value);
         if(response){
             done(null, profile);
         }else {
             // @ts-ignore
             emails.push(profile.emails[0].value);
             done(null, profile);
         }
        }
    ));
}