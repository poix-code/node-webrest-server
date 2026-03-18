import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { envs } from "../../config/envs";


export const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: envs.POSTGRES_URL })
});