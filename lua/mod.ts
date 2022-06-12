import { cstr2ptr } from "https://deno.land/x/ffi/mod.ts";

const libName = {
  darwin: "liblua.dylib",
  linux: "liblua.so",
  windows: "lua51.dll",
}[Deno.build.os];

const lib = Deno.dlopen(libName, {
  // lua_State *luaL_newstate (void);
  luaL_newstate: { parameters: [], result: "pointer" },
  // void luaL_openlibs (lua_State *L);
  luaL_openlibs: { parameters: ["pointer"], result: "void" },
  // void lua_close (lua_State *L);
  lua_close: { parameters: ["pointer"], result: "void" },
  // int luaL_loadstring (lua_State *L, const char *s);
  luaL_loadstring: { parameters: ["pointer", "pointer"], result: "i32" },
  // int lua_pcallk (lua_State *L, int nargs, int nresults, int msgh, lua_KContext ctx, lua_KFunction k);
  lua_pcallk: {
    parameters: ["pointer", "i32", "i32", "i32", "pointer", "pointer"],
    result: "i32",
  },
  // int lua_gettop (lua_State *L);
  lua_gettop: { parameters: ["pointer"], result: "i32" },
  // void lua_pop (lua_State *L, int n);
  lua_pop: { parameters: ["pointer", "i32"], result: "void" },
});

export type lua_State = Deno.UnsafePointer;
export const LUA_OK = 0;

export function luaL_newstate(): lua_State {
  const l = lib.symbols.luaL_newstate() as lua_State;

  if (l.value === 0n) {
    throw new Error("memory allocation error.");
  }

  return l;
}

export function luaL_openlibs(l: lua_State) {
  return lib.symbols.luaL_openlibs(l) as void;
}

export function lua_close(l: lua_State) {
  return lib.symbols.lua_close(l) as void;
}

export function luaL_loadstring(l: lua_State, s: string): void {
  if (lib.symbols.luaL_loadstring(l, cstr2ptr(s)) !== LUA_OK) {
    // TODO: Display specific error messages
    throw new Error("luaL_loadstring error");
  }
}

export function lua_pcall(
  l: lua_State,
  nargs: number,
  nresults: number,
  msgh: number,
): number {
  return lib.symbols.lua_pcallk(
    l,
    nargs,
    nresults,
    msgh,
    new Deno.UnsafePointer(0n),
    new Deno.UnsafePointer(0n),
  ) as number;
}

export function lua_gettop(l: lua_State): number {
  return lib.symbols.lua_gettop(l) as number;
}

export function lua_pop(l: lua_State, n: number): void {
  return lib.symbols.lua_pop(l, n) as void;
}

export function dlclose() {
  lib.close();
}
