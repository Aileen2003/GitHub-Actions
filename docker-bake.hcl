target "build" {
  context    = "."
  dockerfile = "Dockerfile"
  tags       = ["aileen2003/github-actions:latest"]
}

target "validate-build" {
  inherits = ["build"]
  call     = "check"
}
