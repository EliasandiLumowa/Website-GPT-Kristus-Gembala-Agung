import { createClient } from "@libsql/client";

async function testTurso() {
  const url = "libsql://gereja-db-eliasans.aws-ap-northeast-1.turso.io";
  const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTAyMzU0NDgsImlkIjoiMDFhMGQyNTgtMWIwMS03NDI2LWFhOWEtZDk4MTAyOGI3YjNjIiwia2lkIjoiMjBNQ2VzZGJjLVdfS2RQa2dLUjB6WEtCZGhWcFJUblJCLUJjUC1Lb2FlQSIsInJpZCI6ImU1ZWYxZjA5LTBkOTYtNDVjMC04NWQwLTc4M2JiOWIwYmNhNiJ9.pOr1faEoiOA12M_FkvKsnuRXIyQq58nCDX4daIBVJ24bryhtRv1sjhwXU1P3Q0yoW5TSIEgV8yW9Wbjl2Kb5Dg";
  try {
    const client = createClient({ url, authToken });
    const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
    console.log("Tables in Turso:", res.rows.map(r => r.name));
  } catch (err: any) {
    console.error("Turso error:", err.message);
  }
}

testTurso();
  