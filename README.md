# S3 Unzip

Lambda to unzip new archives on s3 bucket, written in typescript and managed by terraform.
By default the Lambda function is run when a file is created in the specified S3 bucket.

## Examples

### Extract all files in the same bucket

```
module s3-unzip {
  source         = "zaqqaz/s3-unzip-terraform"

  dest_prefix    = "extracted/"
  dest_key       = "$zipFilename/$filename.$extension"
  src_bucket     = "my.s3.bucket"
  src_prefix     = "zip/"
}
```

### Extract .js files from one bucket to another

```
module s3-unzip {
  source         = "zaqqaz/s3-unzip-terraform"

  dest_bucket    = "my.dest.s3.bucket"
  src_bucket     = "my.source.s3.bucket"
  match_regex    = "/^[^/]+.js$/"
}
```

### Extract .js files but rename them to match the zip filename

```
module s3-unzip {
  source         = "zaqqaz/s3-unzip-terraform"

  dest_key       = "$zipFilename.$extension"
  src_bucket     = "my.s3.bucket"
  src_prefix     = "zip/"
  match_regex    = "/^[^/]+.js$/"
}
```

### Extract all files in the same bucket, and delete the zip file after

```
module s3-unzip {
  source         = "zaqqaz/s3-unzip-terraform"

  dest_prefix    = "extracted/"
  dest_key       = "$zipFilename/$filename.$extension"
  src_bucket     = "my.s3.bucket"
  src_prefix     = "zip/"

  delete_source = true
}
```


**p.s. Special credits to https://github.com/robbytaylor/terraform-aws-s3-unzip 
from which initial idea and part of the configuration were copy-pasted, unfortunately, there were some issues, like a wrong content-type
in order to fix them and introduce new features this module were born.**
