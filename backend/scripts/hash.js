import bcrypt from "bcryptjs";

const password = "your_password_here";

const hash = await bcrypt.hash(password, 10);

console.log("HASH:", hash);

