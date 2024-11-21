"use server";
import { pool } from "../../../../config/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";


const isAuth = async (username: any, password: any) => {

  const user = await pool.query(
    `SELECT username, name, role, active, id, password
     FROM users 
     WHERE username = ?
     LIMIT 1`,
    [username]
  );

  const userData = user[0] as any[];

  if (userData.length === 0) {
    return null;
  }

  const isPasswordMatch = await bcrypt.compare(password, userData[0]?.password);

  return isPasswordMatch ? user[0] : null;
};


export const POST = async (req: NextRequest) => {

  try {
    const { username, password } = await req.json();

    const user = await isAuth(username, password);

    if (user === null) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 404 });
    }

    const Authenticated = user as any[];

    if (Authenticated[0].active === 0) {
      return NextResponse.json({ message: "Account suspended" }, { status: 404 });
    }

    // create a JWT token
    const accessToken = jwt.sign(
      {
        username: Authenticated[0].username,
        name: Authenticated[0].name,
        role: Authenticated[0].role,
        id: Authenticated[0].id,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "30sec", algorithm: "HS256" }
    );

    const refreshToken = jwt.sign(
      {
        username: Authenticated[0].username,
        name: Authenticated[0].name,
        role: Authenticated[0].role,
        id: Authenticated[0].id,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "15m", algorithm: "HS256" }
    );

    // save the refresh token into the database of the users table

    await pool.query(
      `UPDATE users
            SET RefreshToken = ?
            WHERE username = ?`,
      [refreshToken, Authenticated[0].username]
    );

    // set the cookie max time to 10 seconds
    const expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() + 15 * 60 * 1000);

    // set the cookie with refresh token
    cookies().set("jwt", refreshToken, {
      sameSite: "lax",
      secure: false,
      httpOnly: false,
      expires: expirationTime,
    });


    return NextResponse.json({
      message: "Authenticated",
      id: Authenticated[0].id,
      username: Authenticated[0].username,
      name: Authenticated[0].name,
      role: Authenticated[0].role,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } 
};