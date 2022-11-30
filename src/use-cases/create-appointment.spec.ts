import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/appointment";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";
import { getFutureDate } from "../tests/utils/get-future-date";
import { CreateAppointment } from "./create-appointment";

describe("Create Appointment", () => {
  it("should be able to create an appointment", () => {
    const startsAt = getFutureDate("2022-08-09");
    const endsAt = getFutureDate("2022-08-11");

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const sut = new CreateAppointment(appointmentsRepository);
    //System under test

    expect(
      sut.execute({
        customer: "John Doe",
        startsAt,
        endsAt,
      })
    ).resolves.toBeInstanceOf(Appointment);
  });

  it("should not be able to create an appointment with overlapping dates", async () => {
    const startsAt = getFutureDate("2022-08-10");
    const endsAt = getFutureDate("2022-08-11");

    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const sut = new CreateAppointment(appointmentsRepository);
    //System under test

    await sut.execute({
      customer: "John Doe",
      startsAt,
      endsAt,
    });

    expect(
      sut.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2022-08-09"),
        endsAt: getFutureDate("2022-08-11"),
      })
    ).rejects.toBeInstanceOf(Error);
    expect(
      sut.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2022-08-10"),
        endsAt: getFutureDate("2022-08-11"),
      })
    ).rejects.toBeInstanceOf(Error);
    expect(
      sut.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2022-08-11"),
        endsAt: getFutureDate("2022-08-12"),
      })
    ).rejects.toBeInstanceOf(Error);
    expect(
      sut.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2022-08-10"),
        endsAt: getFutureDate("2022-08-10"),
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
