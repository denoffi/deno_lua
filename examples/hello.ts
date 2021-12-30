#!/usr/bin/env -S deno run --allow-ffi --unstable

// import { isLittleEndian } from "https://deno.land/x/ffi/mod.ts";
import {
  dlclose,
  lua_close,
  lua_gettop,
  lua_pcall,
  lua_pop,
  luaL_loadstring,
  luaL_newstate,
  luaL_openlibs,
} from "../lua/mod.ts";
import type { lua_State } from "../lua/mod.ts";

// The pointer to Lua Virtual Machine and this `lua_State` store all data that
// we share between Lua and Deno.
const l: lua_State = luaL_newstate();

// Opens all standard Lua libraries into the given state.
luaL_openlibs(l);

// Lua code
const code = `print('Hello, World')`;

luaL_loadstring(l, code);
lua_pcall(l, 0, 0, 0);
lua_pop(l, lua_gettop(l));

// Destroys all objects in the given Lua state
lua_close(l);

// close dynamic library 'liblua.so'
dlclose();
