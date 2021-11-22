import { getAwsPubKey, getEthPubKey } from "../aws";
// import getEthPubKey from "../services/commands/aws";

it("should get aws pub key", async () => {

  // const expected = "-----BEGIN PUBLIC KEY-----" +
  // "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEjdRbEVI613n81CxS+QvkHxGuTS0obl4h" +
  // "dr76E2sqSlFmSOspr1+IFnI2QnJrbTPM8tP7ZjiCK4rLXvFZlToDRw==" + 
  // "-----END PUBLIC KEY-----"

  const expected = "3056301006072a8648ce3d020106052b8104000a034200048dd45b11523ad779fcd42c52f90be41f11ae4d2d286e5e2176befa136b2a4a516648eb29af5f8816723642726b6d33ccf2d3fb6638822b8acb5ef159953a0347";
  const actual = await getAwsPubKey();

  expect(actual).toBe(expected);
});

it("should get aws pub key as ETH", async () => {

  // const expected = "-----BEGIN PUBLIC KEY-----" +
  // "MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEjdRbEVI613n81CxS+QvkHxGuTS0obl4h" +
  // "dr76E2sqSlFmSOspr1+IFnI2QnJrbTPM8tP7ZjiCK4rLXvFZlToDRw==" + 
  // "-----END PUBLIC KEY-----"

  const expected = "048dd45b11523ad779fcd42c52f90be41f11ae4d2d286e5e2176befa136b2a4a516648eb29af5f8816723642726b6d33ccf2d3fb6638822b8acb5ef159953a0347";
  const actual = await getEthPubKey();

  expect(actual).toBe(expected);
});