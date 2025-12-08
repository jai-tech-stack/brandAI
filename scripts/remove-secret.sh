#!/bin/bash
# Remove API key from git history
git filter-branch --force --index-filter \
  "git checkout-index -f env.template && \
   sed -i.bak 's/OPENAI_API_KEY=sk-.*/OPENAI_API_KEY=your-openai-api-key-here/g' env.template && \
   rm -f env.template.bak && \
   git add env.template" \
  --prune-empty --tag-name-filter cat -- --all

