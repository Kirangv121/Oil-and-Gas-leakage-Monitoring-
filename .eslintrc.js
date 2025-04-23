module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Disable rules that might cause build issues
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@next/next/no-img-element": "off",
    "jsx-a11y/alt-text": "off",
  },
}
