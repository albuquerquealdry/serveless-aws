#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { EcommerceApiStack } from '../lib/ecommerceApi';
import { HealthcheckStack } from '../lib/healthcheck-stack';
import { ProductsAppLayersStack } from '../lib/productsAppLayers';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "{{ account }}",
  region: "{{ region }}"
}

const tags = {
  cost: "Ecommerce Ayo",
  team: "Syag DevOps Team"
}

const productsAppLayersStack = new ProductsAppLayersStack(app,"ProductsAppLayers", {
  tags: tags,
  env: env
})

const productsAppStack = new ProductsAppStack(app, "ProductsApp",{
  tags: tags, env:env
})

const healthcheckStack = new HealthcheckStack(app, "healthcheck")
const ecommerceApiStack =  new EcommerceApiStack(app, "EcommerceApiStack", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  healthcheckHandler: healthcheckStack.HealthcheckHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env
})

ecommerceApiStack.addDependency(productsAppStack)