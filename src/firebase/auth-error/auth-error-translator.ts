import TranslatedAuthError from "./auth-error-model";
import AuthErrorType from "./auth-error-type-model";

const hu: Record<string, TranslatedAuthError> = {
  "auth/invalid-email": {
    message: "Érvénytelen e-mail cím.",
    type: AuthErrorType.EMAIL,
  },
  "auth/user-disabled": {
    message: "A felhasználói fiók letiltva.",
    type: AuthErrorType.ACCOUNT,
  },
  "auth/user-not-found": {
    message: "A felhasználói fiók nem található.",
    type: AuthErrorType.ACCOUNT,
  },
  "auth/wrong-password": {
    message: "A megadott bejelentkezési adatok hibásak.",
    type: AuthErrorType.PASSWORD,
  },
  "auth/email-already-in-use": {
    message: "Ez az e-mail cím már használatban van.",
    type: AuthErrorType.EMAIL,
  },
  "auth/operation-not-allowed": {
    message: "A bejelentkezési mód nem engedélyezett.",
    type: AuthErrorType.DEV,
  },
  "auth/weak-password": {
    message: "A jelszó túl gyenge.",
    type: AuthErrorType.PASSWORD,
  },
  "auth/missing-android-pkg-name": {
    message: "Hiányzó Android csomagnév.",
    type: AuthErrorType.DEV,
  },
  "auth/missing-continue-uri": {
    message: "Hiányzó folytatási URI.",
    type: AuthErrorType.DEV,
  },
  "auth/missing-ios-bundle-id": {
    message: "Hiányzó iOS csomagnév.",
    type: AuthErrorType.DEV,
  },
  "auth/invalid-continue-uri": {
    message: "Érvénytelen folytatási URI.",
    type: AuthErrorType.DEV,
  },
  "auth/unauthorized-continue-uri": {
    message: "Nem engedélyezett folytatási URI.",
    type: AuthErrorType.DEV,
  },
  "auth/invalid-dynamic-link-domain": {
    message: "Érvénytelen dinamikus hivatkozási tartománynév.",
    type: AuthErrorType.DEV,
  },
  "auth/argument-error": {
    message: "A függvénynek legalább egy argumentumot kell megadni, de kapott 0.",
    type: AuthErrorType.DEV,
  },
  "auth/invalid-persistence-type": {
    message: "A megadott tartóssági típus érvénytelen.",
    type: AuthErrorType.DEV,
  },
  "auth/unsupported-persistence-type": {
    message: "A környezet nem támogatja a megadott tartóssági típust.",
    type: AuthErrorType.DEV,
  },
  "auth/invalid-credential": {
    message: "Érvénytelen hitelesítő adatokat adtak meg.",
    type: AuthErrorType.DEV,
  },
  "auth/invalid-verification-code": {
    message: "Érvénytelen ellenőrző kód.",
    type: AuthErrorType.DEV,
  },
  "auth/invalid-verification-id": {
    message: "Érvénytelen ellenőrzőazonosító.",
    type: AuthErrorType.DEV,
  },
  "auth/custom-token-mismatch": {
    message: "A token nem felel meg a vártnak.",
    type: AuthErrorType.DEV,
  },
  "auth/invalid-custom-token": {
    message: "Érvénytelen token.",
    type: AuthErrorType.DEV,
  },
  "auth/captcha-check-failed": {
    message: "A captcha ellenőrzés sikertelen, próbálja újra.",
    type: AuthErrorType.DEV,
  },
  "auth/invalid-phone-number": {
    message: "Érvénytelen telefonszám.",
    type: AuthErrorType.PHONE,
  },
  "auth/missing-phone-number": {
    message: "Hiányzó telefonszám.",
    type: AuthErrorType.PHONE,
  },
  "auth/quota-exceeded": {
    message: "A kvóta túllépve.",
    type: AuthErrorType.DEV,
  },
  "auth/cancelled-popup-request": {
    message: "A felugró ablak kérést megszakították a felhasználó.",
    type: AuthErrorType.DEV,
  },
  "auth/popup-blocked": {
    message: "A felugró ablakot blokkolta a böngésző.",
    type: AuthErrorType.DEV,
  },
  "auth/popup-closed-by-user": {
    message: "A felhasználó bezárta a felugró ablakot.",
    type: AuthErrorType.DEV,
  },
  "auth/unauthorized-domain": {
    message: "A domain nem engedélyezett a linkekhez.",
    type: AuthErrorType.DEV,
  },
};

export const translate = (code?: string): TranslatedAuthError => {
  if (!code) return { message: "", type: AuthErrorType.DEV };
  const error = hu[code];
  return {
    code,
    message: error.message || code,
    type: error.type,
  };
};
