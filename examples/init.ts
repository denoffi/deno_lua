#!/usr/bin/env -S deno run --allow-ffi --unstable

// import { isLittleEndian } from "https://deno.land/x/ffi/mod.ts";
import {
  dlclose,
  lua_close,
  luaL_newstate,
  luaL_openlibs,
} from "../lua/mod.ts";
import type { lua_State } from "../lua/mod.ts";

// The pointer to Lua Virtual Machine and this `lua_State` store all data that
// we share between Lua and Deno.
const l: lua_State = luaL_newstate();

// Opens all standard Lua libraries into the given state.
luaL_openlibs(l);

// Destroys all objects in the given Lua state
lua_close(l);

// close dynamic library 'liblua.so'
dlclose();
