export default function handler(req, res) {
  const verificationCode =
    "<meta name='google-site-verification' content='PrfXYvrtm3WKY2e6tgMntACI12qpjrzYETac2YjP_nY' />";
  res.status(200).send(verificationCode);
}
