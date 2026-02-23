target "build" {
  context    = "."
  dockerfile = "Dockerfile"
  tags       = ["aileen200/github-actions:latest"]
}

target "validate-build" {
  inherits = ["build"]
  call     = "check"
}
