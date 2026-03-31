package com.laioffer.deliverymanagement;

import com.laioffer.deliverymanagement.dto.AppUserDto;
import com.laioffer.deliverymanagement.dto.DeliveryCenterDto;
import com.laioffer.deliverymanagement.dto.OrderDto;
import com.laioffer.deliverymanagement.service.AppUserService;
import com.laioffer.deliverymanagement.service.DeliveryCenterService;
import com.laioffer.deliverymanagement.service.FleetVehicleService;
import com.laioffer.deliverymanagement.service.OrderParcelService;
import com.laioffer.deliverymanagement.service.OrderService;
import com.laioffer.deliverymanagement.service.OtpChallengeService;
import com.laioffer.deliverymanagement.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DevRunner implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(DevRunner.class);

    private final AppUserService appUserService;
    private final OtpChallengeService otpChallengeService;
    private final DeliveryCenterService deliveryCenterService;
    private final FleetVehicleService fleetVehicleService;
    private final OrderService orderService;
    private final OrderParcelService orderParcelService;
    private final PaymentService paymentService;

    public DevRunner(
            AppUserService appUserService,
            OtpChallengeService otpChallengeService,
            DeliveryCenterService deliveryCenterService,
            FleetVehicleService fleetVehicleService,
            OrderService orderService,
            OrderParcelService orderParcelService,
            PaymentService paymentService
    ) {
        this.appUserService = appUserService;
        this.otpChallengeService = otpChallengeService;
        this.deliveryCenterService = deliveryCenterService;
        this.fleetVehicleService = fleetVehicleService;
        this.orderService = orderService;
        this.orderParcelService = orderParcelService;
        this.paymentService = paymentService;
    }

    @Override
    public void run(ApplicationArguments args) {
        logger.info("Starting DTO + Service + database verification...");

        AppUserDto firstUser = appUserService.findAll().stream().findFirst().orElse(null);
        DeliveryCenterDto firstCenter = deliveryCenterService.findAll().stream().findFirst().orElse(null);
        OrderDto firstOrder = orderService.findAll().stream().findFirst().orElse(null);

        logger.info("app_user count={}, sampleUserId={}, sampleUserEmail={}, sampleGuest={}",
                appUserService.count(),
                firstUser == null ? null : firstUser.id(),
                firstUser == null ? null : firstUser.email(),
                firstUser == null ? null : firstUser.guest());
        logger.info("otp_challenge count={}", otpChallengeService.count());
        logger.info("delivery_center count={}, sampleCenterId={}, sampleCenterName={}",
                deliveryCenterService.count(),
                firstCenter == null ? null : firstCenter.id(),
                firstCenter == null ? null : firstCenter.name());
        logger.info("fleet_vehicle count={}", fleetVehicleService.count());
        logger.info("orders count={}, sampleOrderId={}, sampleStatus={}, sampleAmount={}",
                orderService.count(),
                firstOrder == null ? null : firstOrder.id(),
                firstOrder == null ? null : firstOrder.status(),
                firstOrder == null ? null : firstOrder.totalAmount());
        logger.info("order_parcel count={}", orderParcelService.count());
        logger.info("payment count={}", paymentService.count());

        if (firstUser != null) {
            logger.info("User relation check: userId={} -> otpCount={}, orderCount={}",
                    firstUser.id(),
                    otpChallengeService.findByUserId(firstUser.id()).size(),
                    orderService.findByUserId(firstUser.id()).size());
        }

        if (firstCenter != null) {
            logger.info("Center relation check: centerId={} -> vehicleCount={}",
                    firstCenter.id(),
                    fleetVehicleService.findByCenterId(firstCenter.id()).size());
        }

        if (firstOrder != null) {
            logger.info("Order relation check: orderId={} -> parcelPresent={}, paymentPresent={}",
                    firstOrder.id(),
                    orderParcelService.findByOrderId(firstOrder.id()).isPresent(),
                    paymentService.findByOrderId(firstOrder.id()).isPresent());
        }

        logger.info("DTO + Service + database verification finished.");
    }
}
