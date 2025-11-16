"use client";

import { Fragment } from "react"
import {useAppDispatch, useAppSelector} from "@/lib/hooks";
import {handleAuthenticationLogin} from "@/lib/Features/authSlice";

export default function HOME() {

    const auth = useAppSelector((state) => state.auth.isAuthenticated)
    const dispatch = useAppDispatch();

  return (
    <Fragment>
        <div className="text-white">
            <h1>isAuthenticated:: {auth.toString()}</h1>
            <button onClick={() => dispatch(handleAuthenticationLogin())}>Click to change Authenticate values:: </button>
        </div>
    </Fragment>

  )
} 