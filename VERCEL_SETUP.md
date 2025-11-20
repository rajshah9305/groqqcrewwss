# Vercel Environment Variable Setup Guide

This guide will walk you through the process of setting up the necessary environment variables for your RAJAI Platform project in Vercel. This is a crucial step to ensure your application connects to the database and the Groq API correctly.

## 1. Open Your Vercel Project

Navigate to your project in the Vercel dashboard.

## 2. Go to Project Settings

Click on the **Settings** tab for your project.

## 3. Go to Environment Variables

In the left-hand menu, click on **Environment Variables**.

## 4. Add the Database URL

*   **Key:** `DATABASE_URL`
*   **Value:** Your PostgreSQL connection string from Neon (e.g., `postgresql://user:password@host/database?sslmode=require`)
*   **Environments:** Make sure to select **Production**, **Preview**, and **Development**.

Click **Save**.

## 5. Add the Groq API Key

*   **Key:** `GROQ_API_KEY`
*   **Value:** Your Groq API key from [Groq Console](https://console.groq.com/keys)
*   **Environments:** Make sure to select **Production**, **Preview**, and **Development**.

Click **Save**.

## 6. Add the OpenAI API Key (Dummy)

*   **Key:** `OPENAI_API_KEY`
*   **Value:** `dummy-key-to-disable-openai`
*   **Environments:** Make sure to select **Production**, **Preview**, and **Development**.

Click **Save**.

## 7. Redeploy Your Application

After adding these environment variables, you need to redeploy your application for the changes to take effect.

*   Go to the **Deployments** tab.
*   Click the **Redeploy** button for the latest deployment.

## 8. Verify the Deployment

Once the deployment is complete, you can verify that the environment variables are set up correctly by visiting the health check endpoint:

`https://groqqcrewwssws-9ympvfh8n-rajshah9305s-projects.vercel.app/api/health`

You should see a success message indicating that the database connection is healthy.

Please follow these steps and let me know once you have redeployed the application. I will then proceed with testing the application to ensure everything is working as expected.
